import Vue from 'vue'

const setup = (modal, closeFunc) => {
  const focusableEls = 'button, a, input, textarea, select'
  const focusables = Array.from(modal.querySelectorAll(focusableEls))

  window.addEventListener('keydown', event => {
    const key = (event.key || '__unknownkey__').toLowerCase() // not sure about the capitalization
    const modalOpened = modal.classList.contains('opened')
    // close on escape key
    if ((key === 'escape' || key === 'esc') && modalOpened) {
      closeFunc()
    }
    // keep focus inside the modal
    if (key === 'tab' && modalOpened) {
      // prevent default navigation
      event.preventDefault()
      // get the tabindex of the currently focused element
      let focusIndex = focusables.findIndex(
        f => f === modal.querySelector(':focus')
      )
      // get the tabindex of the element to focus after the keypress
      if (event.shiftKey) {
        // backwards navigation: shift-tab
        focusIndex--
      } else {
        focusIndex++
      }
      // if we go past the last focusable element
      if (focusIndex >= focusables.length) {
        // loop back to the beginning
        focusIndex = 0
      }
      // if we go past the the first focusable element (by shift-tabbing, mostly)
      if (focusIndex < 0) {
        // loop back to the end
        focusIndex = focusables.length - 1
      }
      focusables[focusIndex].focus()
    }
  })
}

const close = name => {
  // console.log(`$modal: Closing ${name}`)
  const modal = document.getElementById(`modal_${name}`)
  // // console.log(modal)
  if (modal === null) return
  modal.classList.remove('opened')
  modal.setAttribute('aria-hidden', 'true')
  modal.setAttribute('aria-modal', 'false')
  // restore focus if we had any
  const wasFocused = document.querySelector(':focus')
  if (wasFocused !== null) {
    wasFocused.focus()
  }
}
const $modal = {
  show: (name, opts = { at: null, from: null, stretch: null }) => {
    // console.log(`$modal: Opening ${name}`)
    let openAt = opts.at || 'center'
    const calledBy = opts.from || null
    const modal = document.getElementById(`modal_${name}`)
    if (modal === null) {
      // eslint-disable-next-line
      console.warn('Not opening modal: is null')
      return
    }
    setup(modal, () => {
      close(name)
    })
    if (openAt === 'self' && !calledBy) {
      throw new Error("Summoning a modal at 'self' requires a `from` option")
    }
    // calculate the position of .modal-wrapper:
    // - cented: centered (use display:flex) (default)
    // - self: from the calling element
    // - NUMBERxNUMBER: from a given position
    modal.classList.remove('centered') // clear previous open position state
    const wrapper = modal.querySelector('.modal-wrapper')
    const setPos = coords => {
      wrapper.style.left = wrapper.style.right = wrapper.style.top = wrapper.style.bottom = // clean everything
        ''

      for (const [coord, val] of Object.entries(coords)) {
        wrapper.style[coord] = val + 'px'
      }
    }

    if (openAt === 'self') {
      // Choose which self. to use
      // based on which one will keep the element from
      // overflowing outside of the viewport

      // get position of the calling element
      const { y, x } = calledBy.getBoundingClientRect()
      // if the calling element is in the lower part of the viewport,
      // show it from the bottom (self.bottom). Else, self.top.

      //                                    |--> if the coords are higher == the element is
      //                                   |     below the half-height breakpoint
      const openAtY = window.innerHeight / 2 < y ? 'bottom' : 'top'
      //           |___________________|
      //       get the point at which we pass
      //    into the lower-helf of the viewport

      // Do the same for right/left

      const openAtX = window.innerWidth / 2 < x ? 'right' : 'left'
      openAt = `self.${openAtY}.${openAtX}`
    }

    switch (openAt) {
      case 'center': {
        // easiest one, add class "centered"
        modal.classList.add('centered')
        break
      }

      case 'self.rightof': {
        const { top, left, width } = calledBy.getBoundingClientRect()
        setPos({ left: left + width + 5, top })
        break
      }

      case 'self.center.horizontal': {
        const { top } = calledBy.getBoundingClientRect()
        const contentWidth = wrapper.getBoundingClientRect().width

        // // console.log(e)

        setPos({ top, left: window.innerWidth / 2 - contentWidth / 2 })

        break
      }

      case 'self.center.vertical': {
        const { left } = calledBy.getBoundingClientRect()
        const contentHeight = wrapper.getBoundingClientRect().height

        // // console.log(e)

        setPos({
          left,
          bottom: window.innerHeight / 2 + contentHeight / 2,
        })

        break
      }

      case 'self.center': {
        const contentHeight = wrapper.getBoundingClientRect().height
        const contentWidth = wrapper.getBoundingClientRect().width

        // // console.log(e)

        setPos({
          left: window.innerWidth / 2 - contentWidth / 2,
          bottom: window.innerHeight / 2 + contentHeight / 2,
        })

        break
      }

      case 'self.top.left': {
        // get top/left coordinates of element
        // for absolute positionning
        const { top, left, width } = calledBy.getBoundingClientRect()

        setPos({ top, left })
        if (opts.stretch === 'width') {
          modal.querySelector('.modal-wrapper').style.width = width + 'px'
        }
        break
      }

      case 'self.top.right': {
        // get top/left coordinates of element
        // for absolute positionning
        const { top, left, width } = calledBy.getBoundingClientRect()

        setPos({
          top,
          right: window.innerWidth - (left + width),
        })
        break
      }

      case 'self.bottom.right': {
        // get bottom/right coordinates of element
        // for absolute positionning
        const { top, left, width, height } = calledBy.getBoundingClientRect()

        setPos({
          bottom: window.innerHeight - (top + height),
          right: window.innerWidth - (left + width),
        })
        break
      }

      case 'self.bottom.left': {
        // get bottom/right coordinates of element
        // for absolute positionning
        const { top, left, height } = calledBy.getBoundingClientRect()

        setPos({
          bottom: window.innerHeight - (top + height),
          left,
        })
        break
      }

      case 'self.below.left': {
        // get bottom/right coordinates of element
        // for absolute positionning
        // eslint-disable-next-line
        // console.log('cehck')
        const { top, left, width, height } = calledBy.getBoundingClientRect()
        modal.classList.add('opened')
        const modalHeight = modal
          .querySelector('.modal-wrapper')
          .getBoundingClientRect().height
        modal.classList.remove('opened')

        setPos({
          bottom: window.innerHeight - (top + modalHeight + height),
          left,
        })

        if (opts.stretch === 'width') {
          modal.querySelector('.modal-wrapper').style.width = width + 'px'
        }

        break
      }

      default: {
        // specified coordinates
        const [top, left] = openAt.split('x')
        setPos({ top, left })
        break
      }
    }

    modal.classList.add('opened')
    // capture the currently focused element to
    // get element to focus: the first [modal-autofocus] inside this modal
    let toFocusOnOpenModal = modal.querySelector('[modal-autofocus]')
    // if any autofocus element exists inside this modal
    if (toFocusOnOpenModal) {
      // the first focusable element inside [modal-autofocus] and focus it
      toFocusOnOpenModal = toFocusOnOpenModal
        // .querySelector(focusableEls) // FIXME
        .focus()
    }
    // set WAI-ARIA (accessibility) attrs
    modal.setAttribute('aria-hidden', 'false')
    modal.setAttribute('aria-modal', 'true')
  },
  hide: close,
}

Vue.prototype.$modal = $modal
Vue.prototype.$modal.open = Vue.prototype.$modal.show
Vue.prototype.$modal.close = Vue.prototype.$modal.hide

export default $modal
