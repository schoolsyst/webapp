<template lang="pug">
component.BadgeSubject(
  :style="{backgroundColor: color, color: textColor()(color)}"
  @click="$emit('click')"
  :class="{clickable, multiline}"
  :is="clickable ? 'button' : 'span'"
) {{name || placeholderName}}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "BadgeSubject",
  props: {
    color: {
      type: String,
      default: "#000000",
    },
    name: {
      type: String,
      default: null,
    },
    clickable: {
      type: Boolean,
      default: false
    },
    placeholderName: {
      type: String,
      default: 'Choisir...'
    },
    multiline: {
      type: Boolean,
      default: false
    },
  },
    methods: {
      ...mapGetters(['textColor'])
    }
}
</script>

<style lang="stylus" scoped>
.BadgeSubject
  font-size: 0.8em
  padding: .3em .5em
  border-radius: var(--border-radius)
  align-items: center
  // If white-space set to wrap, will allow multiline subject names 
  // but no ellipsis (harsh overflow cutoff), 
  // else will put ellipsis but restrict to one line.
  &:not(.multiline)
    white-space: nowrap
    flex-shrink: 0
  &.multiline
    white-space wrap
  font-weight normal
  overflow: hidden
  position relative
  display block
  text-overflow ellipsis
  max-height 25vh
  
.clickable
  &:focus, &:hover
    outline: none
    opacity: 0.75
</style>
