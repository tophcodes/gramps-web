import {describe, it, expect} from 'vitest'
import {readFileSync} from 'node:fs'

// Every place that shows a person's name as running text must go through the
// shared helper, otherwise the chosen name format silently does not apply.
const files = [
  'src/components/GrampsjsConnectedParents.js',
  'src/components/GrampsjsChildren.js',
  'src/components/GrampsjsEvent.js',
  'src/components/GrampsjsFamily.js',
  'src/views/GrampsjsViewTimeline.js',
  'src/components/GrampsjsMapSearchbox.js',
]

describe('person names are rendered through one helper', () => {
  it.each(files)('%s does not build the name itself', file => {
    expect(readFileSync(file, 'utf8')).not.toContain('name_given')
  })
})
