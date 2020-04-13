import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import VTooltip from 'v-tooltip'
import Vuex from 'vuex'
import indexStore from '~/store/index'

export const bootstrapComponentTest = (
  component,
  moduleStore,
  defaultPropsData,
  shallow = true
) => {
  const mountFn = shallow ? shallowMount : mount
  const vue = createLocalVue()
  vue.use(Vuex)
  vue.directive('tooltip', VTooltip)
  const store = new Vuex.Store({
    modules: moduleStore,
    ...indexStore
  })
  store.dispatch = jest.fn()
  const mnt = (props) =>
    mountFn(component, {
      propsData: { ...defaultPropsData, ...props },
      localVue: vue,
      store
    })
  return { vue, mnt, store }
}
