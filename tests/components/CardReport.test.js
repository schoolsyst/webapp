import { bootstrapComponentTest } from '../utils'
import CardReport from '~/components/legacy/CardReport.vue'

const { mnt } = bootstrapComponentTest(
  CardReport,
  {},
  {
    title: 'Lorem ispum dolor sit amet',
    type: 'BUG',
    published: new Date(2020, 5, 4, 23, 14, 0, 0),
    github_issue: 42,
  }
)

describe('<CardReport>', () => {
  describe('with a linked github issue', () => {
    test('matches snpashot', () => {
      const CardReport = mnt()
      expect(CardReport).toMatchSnapshot()
    })
  })

  describe('without a linked github issue', () => {
    test('matches snapshot', () => {
      const CardReport = mnt({ github_issue: null, published: null })
      expect(CardReport).toMatchSnapshot()
    })
  })
})
