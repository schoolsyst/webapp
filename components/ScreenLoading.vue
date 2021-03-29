<template lang="pug">
  .loading-wrapper.loading-state(:class="{small, fullscreen, [`spinner-${spinner}`]: true}")
    .loading
      LoadingSpinner
      .text: slot
</template>

<script>
import LoadingSpinner from '~/components/LoadingSpinner.vue'

export default {
  components: { LoadingSpinner },
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: true,
    },
    spinner: {
      type: String,
      default: 'ball',
    },
  },
}
</script>

<style lang="stylus" scoped>
.loading-wrapper
  display flex
  justify-content center
  align-items center

.loading
  display flex
  flex-direction column
  align-items center
  width 100%

.text
  margin-top 2em
  text-align center

&.small p
  font-size 1.2rem

&.small img
  width 300px

&.small h1
  font-size 1.6rem

.buttons
  margin-top 3rem
</style>
