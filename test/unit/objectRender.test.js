import {describe, it, expect} from 'vitest'
import {render} from 'lit'
import {renderIcon, renderPerson, showObject} from '../../src/objectRender.js'

describe('renderIcon checksum', () => {
  it('uses checksum from media object itself', () => {
    const obj = {
      object_type: 'media',
      object: {handle: 'mh1', checksum: 'abc123'},
    }
    expect(renderIcon(obj).values).to.include('abc123')
  })

  it('resolves checksum from extended.media for non-media objects', () => {
    const obj = {
      object_type: 'person',
      object: {
        handle: 'ph1',
        media_list: [{ref: 'mh2', rect: []}],
        extended: {
          media: [{handle: 'mh2', checksum: 'def456'}],
        },
      },
    }
    expect(renderIcon(obj).values).to.include('def456')
  })
})

describe('renderPerson', () => {
  const profile = {
    gramps_id: 'I0001',
    name_given: 'Thị Hương',
    name_surname: 'Nguyễn',
  }

  function textOf(personProfile) {
    const target = document.createElement('div')
    render(renderPerson(personProfile), target)
    return target.textContent.replace(/\s+/g, ' ').trim()
  }

  it('shows the name the server formatted', () => {
    expect(textOf({...profile, name_display: 'Nguyễn Thị Hương'})).toContain(
      'Nguyễn Thị Hương'
    )
  })

  it('falls back to given and surname when the server sends none', () => {
    expect(textOf(profile)).toContain('Thị Hương Nguyễn')
  })
})

describe('showObject for a person', () => {
  function textOf(profile) {
    const target = document.createElement('div')
    render(
      showObject('person', {gramps_id: 'I0001', gender: 1, profile}, {}),
      target
    )
    return target.textContent.replace(/\s+/g, ' ').trim()
  }

  it('shows the name the server formatted', () => {
    expect(
      textOf({
        name_display: 'Nguyễn Thị Hương',
        name_given: 'Thị Hương',
        name_surname: 'Nguyễn',
      })
    ).toContain('Nguyễn Thị Hương')
  })

  it('falls back to given and surname when the server sends none', () => {
    expect(textOf({name_given: 'Thị Hương', name_surname: 'Nguyễn'})).toContain(
      'Thị Hương Nguyễn'
    )
  })
})
