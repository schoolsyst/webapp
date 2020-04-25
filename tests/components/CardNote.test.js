import { bootstrapComponentTest } from '../utils'
import CardNote from '~/components/CardNote.vue'

const { mnt } = bootstrapComponentTest(
  CardNote,
  {},
  {
    subject: {
      color: 'orange',
      name: 'subject',
    },
    name: 'Test',
    uuid: '8cedf-a41435-a15fde-4331c',
  }
)

describe('<CardNote>', () => {
  describe('for external note', () => {
    it('matches snapshot', () => {
      const CardNote = mnt({ format: 'LINK' })
      expect(CardNote).toMatchSnapshot()
    })
  })
  describe('for regular note', () => {
    it('matches snapshot', () => {
      const CardNote = mnt({ format: 'MARKDOWN' })
      expect(CardNote).toMatchSnapshot()
    })
  })
  describe('untitled note', () => {
    it('matches snapshot', () => {
      const CardNote = mnt({ name: undefined, format: 'MARKDOWN' })
      expect(CardNote).toMatchSnapshot()
    })
  })
})
