<template lang="pug">
component.subject(
  :style="{backgroundColor: color || 'var(--black)', color: textColor()(color)}"
  @click="$emit('click')"
  :class="{clickable, multiline, thin, [`variant-${variant}`]: true}"
  :is="clickable ? 'button' : 'span'"
  v-tooltip="!noTooltip ? name : null"
)
  Icon.unknown-icon(v-if="!color") more_horiz
  span.name
    | {{name || placeholderName}}
</template>

<script>
import { mapGetters } from 'vuex'
import Icon from '~/components/Icon.vue'
export default {
  name: "BadgeSubject",
  components: { Icon },
  props: {
    color: {
      type: String,
      default: null,
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
    variant: {
      type: String,
      default: 'badge'
    },
    thin: {
      type: Boolean,
      default: false
    },
    noTooltip: {
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
badge-aspect()
  padding: .7em .7em
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
  .unknown-icon
    display none
dot-aspect()
  size = 1.2em
  height: (size)
  width: (size)
  min-width: (size) / 2
  min-height: (size) / 2
  border-radius: 50%
  display: flex
  flex-shrink: 0
  justify-content: center
  align-items: center
  .name
    display none

.variant-badge
  badge-aspect()
  &.thin
    padding: 0.3em 0.5em
.variant-dot
  dot-aspect()
.variant-pill
  badge-aspect()
  size = 1.5em
  height (size)
  border-radius (size)
  display flex
  align-items center
.variant-responsive
  @media (max-width 650px)
    badge-aspect()
  @media (min-width 651px)
    dot-aspect()

.clickable
  &:focus, &:hover
    outline: none
    opacity: 0.75
.unknown-icon
  color var(--white)
</style>
