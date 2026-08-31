import {describe, it, expect} from 'vitest'
import {grampsStrings} from '../../src/strings.js'

// A label only reaches the translation endpoint if it is listed here, so a
// string used in a component but missing from the list silently stays English.
describe('name format labels are offered for translation', () => {
  const used = [
    'Name format',
    'Display as',
    'Display Name Editor',
    'Format',
    'Name',
    'Default',
    'None',
    '_Add',
    '_Delete',
  ]

  it.each(used)('lists %s', label => {
    expect(grampsStrings).toContain(label)
  })
})
