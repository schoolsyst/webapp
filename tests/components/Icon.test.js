import { bootstrapComponentTest } from '../utils'
import Icon from '~/components/legacy/Icon.vue'

const { mnt } = bootstrapComponentTest(
  Icon
  // Put the default store here
  // Put the default propsData here
)

describe('<Icon>', () => {
  describe('filled', () => {
    it('matches snapshot', () => {
      const Icon = mnt({ filled: true }, { default: 'close' })
      expect(Icon).toMatchSnapshot()
    })
  })
  describe('outline', () => {
    it('matches snapshot', () => {
      const Icon = mnt({ filled: false }, { default: 'close' })
      expect(Icon).toMatchSnapshot()
    })
  })
})
