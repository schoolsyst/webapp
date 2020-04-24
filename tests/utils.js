import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import VTooltip from 'v-tooltip'
import VTouch from 'vue2-touch-events'
import Vuex from 'vuex'
import indexStore from '~/store/index'

export const bootstrapComponentTest = (
  component,
  moduleStore,
  defaultPropsData,
  shallow = true,
  mocks = {}
) => {
  const mountFn = shallow ? shallowMount : mount
  const vue = createLocalVue()
  vue.use(Vuex)
  vue.directive('tooltip', VTooltip)
  vue.directive('touch', VTouch)
  const store = new Vuex.Store({
    modules: moduleStore,
    ...indexStore,
  })
  store.dispatch = jest.fn()
  const mnt = props =>
    mountFn(component, {
      propsData: { ...defaultPropsData, ...props },
      localVue: vue,
      store,
      mocks,
    })
  return { vue, mnt, store }
}
