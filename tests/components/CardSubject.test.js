import { shallowMount, createLocalVue } from '@vue/test-utils'
import VTooltip from 'v-tooltip'
import Vuex from 'vuex'
import { getters } from '../../store/index'
import CardSubject from '~/components/legacy/CardSubject.vue'

const vue = createLocalVue()
vue.directive('tooltip', VTooltip)
vue.use(Vuex)
const store = {
  getters: { textColor: getters.textColor },
}
const mnt = props =>
  shallowMount(CardSubject, {
    propsData: {
      name: 'Lorem ipsum',
      color: '#c0ffee',
      weight: 2,
      goal: 0.7,
      ...props,
    },
    localVue: vue,
    store,
  })

describe('<CardSubject>', () => {
  describe('regular', () => {
    it('matches snapshot', () => {
      const CardSubject = mnt()
      expect(CardSubject).toMatchSnapshot()
    })
  })
  describe('full-color variant', () => {
    it('matches snapshot', () => {
      const CardSubject = mnt({ fullColor: true })
      expect(CardSubject).toMatchSnapshot()
    })
  })
  it('emits a click when clicked', () => {
    const CardSubject = mnt()
    CardSubject.trigger('click')
    expect(CardSubject.emitted('click')).toBeTruthy()
  })
})
