<template lang="pug">
//TODO: "clickable" boolean prop that controls the pointer aspect, 
  or make a SubjectDotClickable? (<button> for non-clickable isn't very semantic...)
component.SubjectDot(is="div" :style="{backgroundColor: bgcolor}", :title="name")
  i.icon.material-icons(v-if="color === 'unknown'") more_horiz
</template>

<script>
export default {
  name: "SubjectDot",
  props: {
    color: {
      type: String,
      default: "unknown",
    },
    name: String,
  },
  computed: {
    bgcolor() {
      return this.color === "unknown" ? "black" : this.color
    },
  },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.SubjectDot
    $size: 1.2em
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
