<template lang="pug">
//TODO: "clickable" boolean prop that controls the pointer aspect, 
  or make a SubjectDotClickable? (<button> for non-clickable isn't very semantic...)
component.SubjectDot(
  :is="clickable ? 'button' : 'div'" 
  :style="{backgroundColor: bgcolor}"
  :title="name"
  :class="{clickable}"
  @click="$emit('click')"
)
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
    clickable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bgcolor() {
      return this.color === "unknown" ? "var(--black)" : this.color
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
    border-radius: 50%
    display: flex
    flex-shrink: 0
    justify-content: center
    align-items: center
    &:focus
      outline: none
    &.clickable
      &:hover, &:focus
        opacity: 0.75

.material-icons
  color: var(--white)

</style>
