<template lang="pug">
  vue-js-modal(:name="name" height="auto" :class="{'no-header': !title && !closeButton}")
    p.title(v-if="title") {{ title }}
    button.close-modal(v-if="closeButton", @click="$modal.hide(name)")
      i.material-icons close
    .modal-content: slot
</template>

<script>
export default {
  props: {
    name: String,
    closeButton: {
      type: Boolean,
      default: true
    },
    title: String
  }
}
</script>

<style lang="stylus" scoped>
modal-padding = 2rem

/deep/ .v--modal-box
  background: var(--white)
  color var(--black)
  padding: (modal-padding)
  padding-top (modal-padding + 2rem)
  overflow: auto !important
  box-shadow none
  @media (min-width 651px)
    border-radius: var(--border-radius)
    max-width: calc(100vw - 2rem)
    max-height: calc(100vh - 2rem)
  @media (max-width 650px)
    width 100vw !important
    // min-height 100vh !important
    left: 0 !important
    right: 0 !important
    top: 0 !important
    height auto !important
    // bottom: 0 !important

.no-header /deep/ .v--modal-box
  padding-top (modal-padding)

button.close-modal
  position absolute
  top 10px
  right 10px
  i
    font-size 2em
    color var(--black)
.title
  position absolute
  top: 15px
  left: 15px
  font-size 1.4em

/deep/ .modal-content
  overflow-y scroll
</style>
