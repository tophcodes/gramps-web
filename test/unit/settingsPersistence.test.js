import {describe, it, expect, beforeEach} from 'vitest'
import {getSettings, updateSettings} from '../../src/api.js'

// jwtDecode only base64-decodes the payload, so an unsigned token is enough.
function tokenForTree(tree) {
  const part = obj =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  return `${part({alg: 'HS256'})}.${part({tree})}.sig`
}

describe('tree-scoped settings survive a missing token', () => {
  beforeEach(() => {
    localStorage.removeItem('grampsjs_settings_tree')
    localStorage.removeItem('grampsjs_settings')
  })

  it('keeps a setting when another write happens without a token', () => {
    localStorage.setItem('access_token', tokenForTree('mytree'))
    updateSettings({nameFormat: '%l %f'}, true)

    // The token expires, so getTreeId falls back to "unknown".
    localStorage.removeItem('access_token')
    updateSettings({columns: {}}, true)

    localStorage.setItem('access_token', tokenForTree('mytree'))
    expect(getSettings().nameFormat).toBe('%l %f')
  })

  it('keeps settings of a second tree', () => {
    localStorage.setItem('access_token', tokenForTree('tree-a'))
    updateSettings({nameFormat: '%l %f'}, true)

    localStorage.setItem('access_token', tokenForTree('tree-b'))
    updateSettings({nameFormat: '%f %l'}, true)

    localStorage.setItem('access_token', tokenForTree('tree-a'))
    expect(getSettings().nameFormat).toBe('%l %f')
  })
})
