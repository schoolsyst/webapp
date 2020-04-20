import { mount, createLocalVue } from '@vue/test-utils'
import VTooltip from 'v-tooltip'
import Vuex from 'vuex'
import CardCourse from '../../components/CardCourse.vue'
import { getters } from '../../store/index'

const vue = createLocalVue()
vue.use(Vuex)
vue.directive('tooltip', VTooltip)
const mockSubject = {
  color: 'red'
}
const store = {
  getters: { textColor: getters.textColor }
}
const mnt = (props) =>
  mount(CardCourse, {
    propsData: { subject: mockSubject, ...props },
    localVue: vue,
    store
  })

describe('<CardCourse>', () => {
  test('is a Vue instance', () => {
    const CardCourse = mnt()
    expect(CardCourse.isVueInstance()).toBeTruthy()
  })

  describe('empty', () => {
    test('matches snapshot', () => {
      const CardCourse = mnt({ empty: true })
      expect(CardCourse).toMatchSnapshot()
    })
  })

  describe('with a course', () => {
    test('matches snapshot', () => {
      const CardCourse = mnt({
        room: 'L102',
        start: new Date(0),
        end: new Date(3600 * 1000)
      })
      expect(CardCourse).toMatchSnapshot()
    })
  })

  test("Emits 'close' when expanded and clicked", () => {
    const CardCourse = mnt({ expanded: true })
    CardCourse.trigger('click')
    expect(CardCourse.emitted('close')).toBeTruthy()
    expect(CardCourse.emitted('click')).toBeTruthy()
  })

  test("Emits 'expand' when not expanded and clicked", () => {
    const CardCourse = mnt()
    CardCourse.trigger('click')
    expect(CardCourse.emitted('expand')).toBeTruthy()
    expect(CardCourse.emitted('click')).toBeTruthy()
  })
})
