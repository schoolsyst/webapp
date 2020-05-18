import { mount, createLocalVue } from '@vue/test-utils'
import VTooltip from 'v-tooltip'
import Vuex from 'vuex'
import BadgeSubject from '../../../components/legacy/BadgeSubject.vue'
import { getters } from '../../../store/index'

const vue = createLocalVue()
vue.directive('tooltip', VTooltip)
vue.use(Vuex)
const store = {
  getters: { textColor: getters.textColor },
}
const mnt = (component, opts) =>
  mount(component, { ...opts, localVue: vue, store })

// TODO #77: Test w/ color:red and color:cyan

describe('<BadgeSubject>', () => {
  test('is a Vue instance', () => {
    const component = mnt(BadgeSubject)
    expect(component.isVueInstance()).toBeTruthy()
  })
  test('is a <button> when clickable', () => {
    const component = mnt(BadgeSubject, {
      propsData: {
        clickable: true,
      },
    })
    expect(component.is('button')).toBeTruthy()
  })
  test('is a <span> when not clickable', () => {
    const component = mnt(BadgeSubject)
    expect(component.is('span')).toBeTruthy()
  })
  describe("variant 'dot'", () => {
    test('matches snapshot', () => {
      const component = mnt(BadgeSubject, { propsData: { variant: 'dot' } })
      expect(component).toMatchSnapshot()
    })
  })
  describe("variant 'badge'", () => {
    test('matches snapshot', () => {
      const component = mnt(BadgeSubject, { propsData: { variant: 'badge' } })
      expect(component).toMatchSnapshot()
    })
  })
  test('click event is fired', () => {
    const component = mnt(BadgeSubject)
    component.trigger('click')
    expect(component.emitted('click')).toBeTruthy()
  })

  test('no tooltip is shown when has attribute [no-tooltip]', () => {
    const component = mnt(BadgeSubject, { propsData: { noTooltip: true } })
    expect(component.vm.tooltipContent).toBeNull()
  })
})
