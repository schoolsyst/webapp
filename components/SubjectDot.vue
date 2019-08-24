<template lang="pug">
button.SubjectDot(:style="{backgroundColor: bgcolor}", :title="name")
  i.icon.material-icons(v-if="color === 'unknown'") more_horiz
</template>

<script>
export default {
  name: "SubjectDot",
  props: {
    color: {
      type: String,
      default: 'unknown'
    },
    name: String
  },
  computed: {
    bgcolor() {
      return this.color === 'unknown' ? 'black' : this.color
    }
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.SubjectDot
    $size: 40px
    height: $size
    width: $size
    min-width: $size / 2
    min-height: $size / 2
    border-radius: $size / 2
    display: flex
    justify-content: center
    align-items: center
    &:focus
      outline: none

.material-icons
  color: white

</style>