import { mount, createLocalVue } from '@vue/test-utils'
import VTooltip from 'v-tooltip'
import ButtonNormal from '../../../components/legacy/ButtonNormal.vue'
const vue = createLocalVue()
vue.directive('tooltip', VTooltip)
const getButtonNormal = props =>
  mount(ButtonNormal, { propsData: props, localVue: vue })

describe('<ButtonNormal>', () => {
  test('Handles external links', () => {
    const btn = getButtonNormal({ href: 'https://ewen.works/' })
    expect(btn.get('.btn').is('a')).toBeTruthy()
    const attrs = btn.get('.btn').attributes()
    expect(Object.keys(attrs)).toContain('target')
    expect(attrs.target).toBe('_blank')
  })
  test('Handles internal links', () => {
    const btn = getButtonNormal({ href: '/homework' })
    expect(btn.get('.btn').is('nuxt-link')).toBeTruthy()
  })
  test('Handles no link (@click binding)', () => {
    const btn = getButtonNormal({ href: null })
    expect(btn.get('.btn').is('button')).toBeTruthy()
  })
  describe('as a button', () => {
    test('Emits a click event', () => {
      const btn = getButtonNormal({ href: null })
      btn.get('.btn').trigger('click')
      expect(btn.emitted('click')).toBeTruthy()
    })
    test('Does not emit a click event when disabled', () => {
      const btn = getButtonNormal({ href: null, disabled: true })
      btn.get('.btn').trigger('click')
      expect(btn.emitted('click')).toBeFalsy()
    })
  })
  test('handles failed validation', () => {
    const btn = getButtonNormal({
      validation: {
        validated: false,
        errors: {
          lorem: ['ipsum', 'dolor', 'sit'],
        },
      },
    })
    expect(Object.keys(btn.get('.btn').attributes())).toContain('disabled')
    expect(btn.vm.validationErrors).toBe(
      `<ul class="default-styles" style="padding-left:1em;text-align:left"><li>ipsum</li></ul>`
    )
  })

  test('is not disabled when validation succeeds', () => {
    const btn = getButtonNormal({
      validation: {
        validated: true,
        errors: {},
      },
    })
    expect(btn.get('.btn').attributes()).not.toContain('disabled')
  })
})
