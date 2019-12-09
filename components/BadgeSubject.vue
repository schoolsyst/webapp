<template lang="pug">
component.BadgeSubject(
  :style="{backgroundColor: color, color: textColor()(color)}"
  @click="$emit('click')"
  :class="{clickable}"
  :is="clickable ? 'button' : 'span'"
) {{name}}
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
      default() {
        return this.abbreviation === "..."
          ? "Choisissez une matière..."
          : this.abbreviation
      },
    },
    clickable: {
      type: Boolean,
      default: false
    }
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
  display: flex
  white-space: nowrap
  justify-content: center
  align-items: center
  font-weight normal
.clickable
  &:focus, &:hover
    outline: none
    opacity: 0.75
</style>
