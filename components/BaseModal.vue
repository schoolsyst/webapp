<template lang="pug"> 
//https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.html 
aside.BaseModal(:id="`modal_${name}`", 
    aria-hidden="true" 
    aria-modal="false" 
    role="dialog" 
    @click.self="$modal.hide(name)" 
    :class="{'edge-to-edge': edgeToEdge}"
) 
    .modal-wrapper
        .header(v-if="closeButton || title")
          p.title(v-if="title") {{ title }}
          button.close-modal(
            v-if="closeButton",
            @click="$modal.hide(name)"
          ): Icon close
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
    title: String
  }, 
  data() { 
    return { wasFocused: null } 
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
    &.opened 
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

.edge-to-edge 
  .modal-wrapper
    padding: 0
  .header
    padding: 20px
 
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
