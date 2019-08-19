<template lang="pug">
//https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.html
aside.BaseModal(:id="`modal_${name}`",
    aria-hidden="true"
    aria-modal="false"
    role="dialog"
    @click.self="close"
)
    .modal-wrapper(:class="{'horizontal-items': horizontalItems}")
        button.close-modal(v-if="showCloseButton", @click="close"): i.material-icons close
        slot

</template>

<script>
export default {
  name: "BaseModal",
  props: {
    opened: Boolean,
    name: String,
    showCloseButton: {
      type: Boolean,
      default: false
    },
    horizontalItems: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { wasFocused: null };
  },
  methods: {
    close() {
      const modal = document.getElementById(`modal_${this.name}`);
      modal.classList.remove("opened");
      modal.setAttribute("aria-hidden", "true");
      modal.setAttribute("aria-modal", "false");
      // restore focus if we had any
      if (this.wasFocused !== null) {
        this.wasFocused.focus();
      }
    }
  },
  mounted() {
    const component = this;
    const modal = document.getElementById(`modal_${component.name}`);
    const focusables = Array.from(
      modal.querySelectorAll("button, a, input, textarea, select")
    );

    document.querySelectorAll(`[open-modal="${component.name}"`).forEach(e => {
      e.addEventListener("click", event => {
        // calculate the position of .modal-wrapper:
        // - cented: centered (use display:flex) (default)
        // - self: from the calling element
        // - NUMBERxNUMBER: from a given position
        modal.classList.remove("centered"); // clear previous open position state
        let openAt = e.getAttribute("open-at") || "center";
        console.log(
          `opening modal ${
            this.name
          } at ${openAt} (${e.tagName.toLowerCase()}.${Array.from(
            e.classList
          ).join(".")})`
        );
        const setPos = coords => {
          let wrapper = modal.querySelector(".modal-wrapper");
          wrapper.style.left = wrapper.style.right = wrapper.style.top = wrapper.style.bottom = // clean everything
            "";

          for (const [coord, val] of Object.entries(coords)) {
            wrapper.style[coord] = val + "px";
            console.log(`.modal-wrapper is at ${coord}=${val}px`)
          }
        };

        switch (openAt) {
          case "center": {
            // easiest one, add class "centered"
            modal.classList.add("centered");
            break;
          }

          case "self": {
            // get top/left coordinates of element
            // for absolute positionning
            let { top, left } = e.getBoundingClientRect();
            setPos({ top, left });
            break;
          }

          case "self.bottom": {
            // get bottom/right coordinates of element
            // for absolute positionning
            let { top, left, width, height } = e.getBoundingClientRect();
            console.log(`got boundingClientRect of:`)
            console.log(e)
            setPos({
                bottom:top + height,
                right:left + width
            });
            break;
          }

          default: {
            // specified coordinates
            let [top, left] = openAt.split("x");
            setPos({ top, left });
            break;
          }
        }

        // capture the currently focused element to
        // restore focus after the modal closes
        modal.classList.add("opened");
        component.wasFocused = document.querySelector(":focus");
        modal.focus();
        modal.setAttribute("aria-hidden", "false");
        modal.setAttribute("aria-modal", "true");
      });
    });

    modal.querySelectorAll("[close-modal]").forEach(e => {
      e.addEventListener("click", event => {
        component.close();
      });
    });

    window.addEventListener("keydown", event => {
      const key = event.key.toLowerCase(); // not sure about the capitalization
      let modalOpened = modal.classList.contains("opened");
      // close on escape key
      if ((key === "escape" || key === "esc") && modalOpened) {
        component.close();
      }
      // keep focus inside the modal
      if (key === "tab" && modalOpened) {
        // prevent default navigation
        event.preventDefault();
        // get the tabindex of the currently focused element
        let focusIndex = focusables.findIndex(
          f => f === modal.querySelector(":focus")
        );
        // get the tabindex of the element to focus after the keypress
        if (event.shiftKey) {
          // backwards navigation: shift-tab
          focusIndex--;
        } else {
          focusIndex++;
        }
        // if we go past the last focusable element
        if (focusIndex >= focusables.length) {
          // loop back to the beginning
          focusIndex = 0;
        }
        // if we go past the the first focusable element (by shift-tabbing, mostly)
        if (focusIndex < 0) {
          // loop back to the end
          focusIndex = focusables.length - 1;
        }
        focusables[focusIndex].focus();
      }
    });
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.BaseModal
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    display: flex
    &.centered
        justify-content: center
        align-items: center
    &.opened
        background: rgba(0,0,0,0.5)
        // backdrop-filter: blur(5px)
        opacity: 1
    &:not(.opened)
        pointer-events: none
        opacity: 0
        background: transparent
        // backdrop-filter: blur(1px)
    z-index: 1000
    transition: all .25s ease

.modal-wrapper
    border-radius: 10px
    background: #ffffff
    // width: 600px
    padding: 20px
    max-width: calc(100vw - 20px)
    max-height: calc(100vh - 20px)
    &.horizontal-items
        display: flex
        align-items: center

.BaseModal:not(.centered) .modal-wrapper
    position: fixed

button.close-modal
    position: relative
    top: 10px
    right: 10px

</style>