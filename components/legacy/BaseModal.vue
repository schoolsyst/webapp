<template lang="pug">
//TODO(beta-1.0.0): do not open in full screen modals w/o close btns @ mobile
//https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.html
aside.BaseModal(:id="`modal_${name}`",
    aria-hidden="true"
    aria-modal="false"
    role="dialog"
    @click.self="!noBackdrop && closeModal()"
    :class="{'edge-to-edge': edgeToEdge, 'no-backdrop': noBackdrop, shadow, 'has-header': hasHeader, 'close-button': closeButton, 'no-close-button': !closeButton}"
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
            @click="closeModal"
          ): Icon close
        template(v-if="hasHeader")
          .content: slot
        template(v-else)
          slot

</template>

<script>
import Icon from '~/components/legacy/Icon.vue'

export default {
  name: 'BaseModal',
  components: { Icon },
  props: {
    name: {
      type: String,
      required: true,
    },
    closeButton: {
      type: Boolean,
      default: true,
    },
    edgeToEdge: {
      type: Boolean,
      default: false,
    },
    noBackdrop: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    resizable: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return { wasFocused: null }
  },
  computed: {
    hasHeader() {
      return this.closeButton || this.title
    },
  },
  methods: {
    closeModal() {
      this.$emit('close')
      this.$modal.close(this.name)
    },
  },
}
</script>

<style lang="stylus" scoped>
.BaseModal
  position fixed
  top 0
  left 0
  display flex
  width 100%
  height 100%

  &.centered
    justify-content center
    align-items center

  &.opened:not(.no-backdrop)
    background var(--modal-backdrop)
    opacity 1

  &:not(.opened)
    background transparent
    opacity 0
    pointer-events none

  z-index 10000
  transition all 0.25s ease

.modal-wrapper
  position relative
  overflow auto
  padding 20px
  max-width 100vw
  max-height 100vh
  border-radius var(--border-radius)
  background var(--white)
  color var(--black)

@media (max-width: 650px)
  aside.close-button > .modal-wrapper
    width 100vw
    height 100vh
    border-radius 0

  aside.no-close-button > .modal-wrapper
    width 100vw
    border-radius 0

.has-header
  .modal-wrapper
    display grid
    //5em ~= header height
    grid-template-rows 5em auto

:not(.has-header) .modal-wrapper
  display block

.edge-to-edge
  .modal-wrapper
    padding 0

  .header
    padding 20px

.shadow
  &.opened .modal-wrapper
    box-shadow var(--shadow-2)

  &
    transition-duration 0.125s

.BaseModal:not(.centered) .modal-wrapper
  position fixed

.header
  display flex
  align-items center
  padding 0.5em 0.5em 1.5em

button.close-modal
  margin-left auto

  i
    color var(--black)
    font-size 2em

.title
  margin-right 2vw
  font-size 1.4em
</style>
