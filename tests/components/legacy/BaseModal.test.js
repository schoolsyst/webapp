import { mount, createLocalVue } from '@vue/test-utils'
import BaseModal from '../../../components/legacy/BaseModal.vue'
import $modal from '../../../plugins/vue-js-modal'

const vue = createLocalVue()
vue.use($modal)

describe('<BaseModal>', () => {
  const getModal = props =>
    mount(BaseModal, {
      propsData: {
        name: 'lorem-ipsum',
        ...props,
      },
    })
  describe('opened', () => {
    test('is visible', () => {
      const component = getModal()
      expect(component.isVisible()).toBeTruthy()
    })
    test('closes when the backdrop is clicked', () => {
      const component = getModal()
      component.get('aside').trigger('click')
      expect(component.emitted('close')).toBeTruthy()
      setTimeout(() => {
        expect(component.isVisible()).toBeFalsy()
      }, 1000)
    })
    test('closes when the close arrow is clicked', () => {
      const component = getModal({ closeButton: true })
      component.get('.close-modal').trigger('click')
      expect(component.emitted('close')).toBeTruthy()
      setTimeout(() => {
        expect(component.isVisible()).toBeFalsy()
      }, 1000)
    })
    test('does not close on backdrop click when [no-backdrop] is true', () => {
      const component = getModal({ noBackdrop: true })
      component.get('aside').trigger('click')
      expect(component.emitted('close')).toBeFalsy()
      setTimeout(() => {
        expect(component.isVisible()).toBeTruthy()
      }, 1000)
    })
  })
  test('A close button is shown when [close-button] is true', () => {
    const modal = getModal({ closeButton: true })
    expect(modal.contains('.close-button')).toBeTruthy()
  })
  test('No close button is shown when [close-button] is false', () => {
    const modal = getModal({ closeButton: false })
    expect(modal.contains('.close-button')).toBeFalsy()
  })
  test('The title is shown in the header if set', () => {
    const modal = getModal({ title: 'Lorem ipsum' })
    const title = modal.get('.header .title').text()
    expect(title).toBe('Lorem ipsum')
  })
})
