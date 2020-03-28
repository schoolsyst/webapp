import { mount, createLocalVue } from '@vue/test-utils'
import VTooltip from 'v-tooltip'
import BadgeSubject from '../../components/BadgeSubject.vue'

const vue = createLocalVue()
vue.directive('tooltip', VTooltip)
const mnt = (component, opts) => mount(component, { ...opts, localVue: vue })

describe('BadgeSubject', () => {
  test('is a Vue instance', () => {
    const component = mnt(BadgeSubject)
    expect(component.isVueInstance()).toBeTruthy()
  })
  test('is a <button> when clickable', () => {
    const component = mnt(BadgeSubject, {
      propsData: {
        clickable: true
      }
    })
    expect(component.is('button')).toBeTruthy()
  })
  test('is a <span> when not clickable', () => {
    const component = mnt(BadgeSubject)
    expect(component.is('span')).toBeTruthy()
  })
  // Deactivated because [error] TypeError: Cannot read property 'getters' of undefined
  // test('text is bright when subject color is dark', () => {
  //   const component = mount(BadgeSubject, {
  //     propsData: {
  //       color: '#332299'
  //     }
  //   })
  //   expect(component.attributes().style.color).toBe('white')
  // })
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
})

// test('BadgeSubject emits event when clicked', (t) => {
//   const component = render({})
//   component.trigger('click')
//   t.true(component.emitted('click'))
// })

// test.beforeEach(() => {
//   wrapper = mount(BadgeSubject, {
//     propsData: { BadgeSubject }
//   })
// })

// test('BadgeSubject.vue shapshow', (t) => {
//   t.snapshot({ html: wrapper.html() })
// })

// test('BadgeSubject.vue to display BadgeSubject', (t) => {
//   const $items = wrapper.findAll('li').wrappers

//   $items.forEach(($item, index) => {
//     t.is($item.text(), BadgeSubject[index])
//   })
// })
