<template lang="pug">
  component(
    :is="small ? 'h3' : 'h2'"
    :class="{ buttons, small }"
    class="HeadingSub"
    @click="$emit('click')"
  )
    slot
</template>

<script>
export default {
  name: 'HeadingSub',

  props: {
    buttons: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.HeadingSub
  text-transform: uppercase
  font-weight: bold
  letter-spacing: 0.09em
  // margin-top: 60px
  font-size: 1.2em
  &.small
    font-size: 0.9em

+desktop
  .HeadingSub
    display: inline-flex
    align-items: center
+mobile
  .HeadingSub
    margin-top: 10px
</style>
