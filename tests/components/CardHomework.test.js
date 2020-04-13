import { bootstrapComponentTest } from '../utils'
import CardHomework from '~/components/CardHomework.vue'
// import homework from '~/store/homework'

const mockHomework = {
  uuid: 'c0ffee-daedead-b16b00b5',
  subject: {
    name: 'Subject',
    color: '#c0ffee'
  },
  progress: 0.3,
  type: 'HOMEWORK',
  name: 'Lorem ipsum',
  details:
    'Lorem ipsum dolor sit amet consecitur nae doe flat is justice et deald.'
}
const homeworkStore = {
  actions: {
    switchCompletion: jest.fn()
  }
}

const { mnt, store } = bootstrapComponentTest(
  CardHomework,
  { homework: homeworkStore },
  mockHomework
)

describe('<CardHomework>', () => {
  it('is a Vue instance', () => {
    const CardHomework = mnt()
    expect(CardHomework.isVueInstance()).toBeTruthy()
  })

  describe('completed state', () => {
    const CardHomework = mnt({ progress: 1 })
    it('matches snapshot', () => {
      expect(CardHomework).toMatchSnapshot()
    })
  })

  describe('uncompleted state', () => {
    const CardHomework = mnt({ progress: 0 })
    it('matches snapshot', () => {
      expect(CardHomework).toMatchSnapshot()
    })
  })

  it('calls switchCompletion when the complete slider is clicked', () => {
    const CardHomework = mnt({ progress: 0 })
    CardHomework.get('.complete-slider').trigger('click')
    setTimeout(() => {
      expect(CardHomework.emitted('completion-switch')).toBeTruthy()
      expect(CardHomework.emitted('completion-switch')[1]).toEqual(true)
      expect(store.dispatch).toHaveBeenCalledWith('homework/switchCompletion', {
        uuid: mockHomework.uuid
      })
    }, 500)
  })

  it("doesn't call switchCompletion when the card is clicked", () => {
    const CardHomework = mnt()
    CardHomework.trigger('click')
    setTimeout(() => {
      expect(store.dispatch).not.toHaveBeenCalled()
    }, 500)
  })

  it('emits a click event when the card is clicked', () => {
    const CardHomework = mnt()
    CardHomework.trigger('click')
    expect(CardHomework.emitted('click')).toBeTruthy()
  })
})
