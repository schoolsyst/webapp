import { mount } from '@vue/test-utils'
import BadgeSubject from '../../components/BadgeSubject.vue'

describe('BadgeSubject', () => {
  test('is a Vue instance', () => {
    const component = mount(BadgeSubject)
    expect(component.isVueInstance()).toBeTruthy()
  })
  test('is a <button> when clickable', () => {
    const component = mount(BadgeSubject, {
      propsData: {
        clickable: true
      }
    })
    expect(component.is('button')).toBeTruthy()
  })
  test('is a <span> when not clickable', () => {
    const component = mount(BadgeSubject)
    expect(component.is('span')).toBeTruthy()
  })
  test('text is bright when subject color is dark', () => {
    const component = mount(BadgeSubject, {
      propsData: {
        color: '#332299'
      }
    })
    expect(component.attributes().style).toMatch(/color:\s*white/)
  })
  describe("variant 'dot'", () => {
    test('matches snapshot', () => {
      const component = mount(BadgeSubject, { propsData: { variant: 'dot' } })
      expect(component).toMatchSnapshot()
    })
  })
  describe("variant 'badge'", () => {
    test('matches snapshot', () => {
      const component = mount(BadgeSubject, { propsData: { variant: 'badge' } })
      expect(component).toMatchSnapshot()
    })
  })
  test('click event is fired', () => {
    const component = mount(BadgeSubject)
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
