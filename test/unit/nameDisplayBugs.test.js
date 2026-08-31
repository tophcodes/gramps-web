import {describe, it, expect, vi} from 'vitest'
import {render} from 'lit'
import {GrampsjsPerson} from '../../src/components/GrampsjsPerson.js'
import {GrampsjsViewSettingsUser} from '../../src/views/GrampsjsViewSettingsUser.js'

describe('person page honours the formatted name', () => {
  function textOf(profile) {
    const element = new GrampsjsPerson()
    element.data = {profile}
    const target = document.createElement('div')
    render(element._displayName(), target)
    return target.textContent.replace(/\s+/g, ' ').trim()
  }

  it('uses the name the server formatted', () => {
    expect(
      textOf({
        name_display: 'Nguyễn Thị Hương',
        name_given: 'Thị Hương',
        name_surname: 'Nguyễn',
      })
    ).to.equal('Nguyễn Thị Hương')
  })

  it('falls back to given and surname when the server sends none', () => {
    expect(textOf({name_given: 'Thị Hương', name_surname: 'Nguyễn'})).to.equal(
      'Thị Hương Nguyễn'
    )
  })
})

describe('settings load the formats when the view is shown', () => {
  it('fetches once the view is active', () => {
    const element = new GrampsjsViewSettingsUser()
    element.appState = {apiGet: vi.fn().mockResolvedValue({data: []})}
    element._fetchNameFormats = vi.fn()
    element.active = true

    element._maybeFetchNameFormats()

    expect(element._fetchNameFormats).toHaveBeenCalledOnce()
  })

  it('does not fetch while the view is hidden', () => {
    const element = new GrampsjsViewSettingsUser()
    element._fetchNameFormats = vi.fn()
    element.active = false

    element._maybeFetchNameFormats()

    expect(element._fetchNameFormats).not.toHaveBeenCalled()
  })

  it('does not fetch a second time once loaded', () => {
    const element = new GrampsjsViewSettingsUser()
    element._fetchNameFormats = vi.fn()
    element.active = true
    element._nameFormats = [{number: 1, name: 'X', format: '%l %f'}]

    element._maybeFetchNameFormats()

    expect(element._fetchNameFormats).not.toHaveBeenCalled()
  })
})

describe('format loading survives a late appState', () => {
  it('attempts no fetch while appState is still missing', () => {
    const element = new GrampsjsViewSettingsUser()
    element.active = true
    element.appState = undefined
    element._fetchNameFormats = vi.fn()

    element._maybeFetchNameFormats()

    // An async call here would reject silently and never be retried.
    expect(element._fetchNameFormats).not.toHaveBeenCalled()
  })

  it('fetches once appState has arrived', () => {
    const element = new GrampsjsViewSettingsUser()
    element.active = true
    element.appState = undefined
    element._maybeFetchNameFormats()

    element.appState = {apiGet: vi.fn().mockResolvedValue({data: []})}
    element._maybeFetchNameFormats()

    expect(element.appState.apiGet).toHaveBeenCalledWith('/api/name-formats/')
  })
})
