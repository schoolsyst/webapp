<template lang="pug">
  vue-js-modal(:name="name" height="auto")
    button.close-modal(v-if="closeButton", @click="$modal.hide(name)")
      i.material-icons close
    slot
</template>

<script>
export default {
  props: {
    name: String,
    closeButton: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="stylus" scoped>
/deep/ .v--modal-box
  background: var(--white)
  color var(--black)
  padding: 2rem
  overflow-x: hidden
  box-shadow none
  @media (min-width 651px)
    border-radius: var(--border-radius)
    max-width: calc(100vw - 2rem)
    max-height: calc(100vh - 2rem)
  @media (max-width 650px)
    width 100vw !important
    height 100vh !important
    overflow-y auto
    left: 0 !important
    right: 0 !important
    top: 0 !important
    bottom: 0 !important

button.close-modal
  position absolute
  top 10px
  right 10px
  i
    font-size 2em
    color var(--black)
</style>
