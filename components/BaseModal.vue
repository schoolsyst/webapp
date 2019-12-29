<template lang="pug"> 
//https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.html 
aside.BaseModal(:id="`modal_${name}`", 
    aria-hidden="true" 
    aria-modal="false" 
    role="dialog" 
    @click.self="$emit('close'); $modal.hide(name)" 
    :class="{'edge-to-edge': edgeToEdge, 'no-backdrop': noBackdrop, shadow, 'has-header': hasHeader}"
) 
    .modal-wrapper(
      :style="{\
        resize: resizable || 'none',\
      }"
    )
        .header(v-if="hasHeader")
          p.title(v-if="title") {{ title }}
          button.close-modal(
            v-if="closeButton",
            @click="$modal.hide(name)"
          ): Icon close
        template(v-if="hasHeader")
          .content: slot
        template(v-else)
          slot
 
</template> 
 
<script> 
import Icon from '~/components/Icon.vue'

export default { 
  name: "BaseModal", 
  components: { Icon },
  props: { 
    name: String, 
    closeButton: { 
      type: Boolean, 
      default: true, 
    }, 
    edgeToEdge: {
      type: Boolean,
      default: false
    },
    noBackdrop: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: Boolean,
      default: false
    },
    title: String,
    resizable: {
      type: [Boolean, String],
      default: false
    },
  }, 
  data() { 
    return { wasFocused: null } 
  },
  computed: {
    hasHeader() { return this.closeButton || this.title }
  }
} 
</script> 
 
<style lang="stylus" scoped> 
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
    &.opened:not(.no-backdrop)
        background: var(--modal-backdrop)
        opacity: 1 
    &:not(.opened) 
        pointer-events: none 
        opacity: 0 
        background: transparent 
    z-index: 10000 
    transition: all .25s ease 
 
.modal-wrapper 
    position: relative 
    border-radius: var(--border-radius) 
    background: var(--white) 
    color var(--black) 
    padding: 20px
    overflow: auto
    max-height 100vh
    max-width 100vw
    @media (max-width 650px)
      width 100vw
      height 100vh
      border-radius 0

.has-header
  .modal-wrapper
    display grid
    // 5em ~= header height
    grid-template-rows 5em auto
:not(.has-header) .modal-wrapper
  display block
.edge-to-edge 
  .modal-wrapper
    padding: 0
  .header
    padding: 20px
 
.shadow
  &.opened .modal-wrapper
    box-shadow var(--shadow-2)
  &
    transition-duration 0.125s

.BaseModal:not(.centered) .modal-wrapper 
    position: fixed
 
.header
  display: flex
  padding 0.5em 0.5em 1.5em 0.5em
  align-items center
button.close-modal 
  margin-left auto
  i
    font-size 2em
    color var(--black)
.title
  font-size 1.4em
  margin-right 2vw
  
</style> 
