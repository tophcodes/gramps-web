import {describe, it, expect, vi} from 'vitest'
import {GrampsjsFormName} from '../../src/components/GrampsjsFormName.js'

describe('per-name display format override', () => {
  const makeElement = () => {
    const element = new GrampsjsFormName()
    element.data = {_class: 'Name', first_name: 'Thị Hương'}
    vi.spyOn(element, 'handleChange').mockImplementation(() => {})
    return element
  }

  it('records the chosen format as a number', () => {
    const element = makeElement()

    element._handleDisplayAsChanged({target: {value: '-1'}})

    expect(element.data.display_as).toBe(-1)
    expect(element.handleChange).toHaveBeenCalledOnce()
  })

  it('records the default choice as zero', () => {
    const element = makeElement()

    element._handleDisplayAsChanged({target: {value: '0'}})

    // Name.DEF is 0 and means the name carries no override.
    expect(element.data.display_as).toBe(0)
  })

  it('keeps the rest of the name untouched', () => {
    const element = makeElement()

    element._handleDisplayAsChanged({target: {value: '-1'}})

    expect(element.data.first_name).to.equal('Thị Hương')
  })
})
