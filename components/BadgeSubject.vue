<template lang="pug">
component.subject(
  :is="element"
  :style="{backgroundColor, color: subjectNameColor}"
  :class="{clickable, multiline, thin, inline}"
  :data-variant="variant"
  type="button"
  @click="$emit('click')"
  v-tooltip="tooltipContent"
)
  Icon(v-if="!color").unknown-icon more_horiz
  span.name {{ name || placeholderName }}
</template>

<script>
import { mapGetters } from 'vuex'
import Icon from '~/components/Icon.vue'
export default {
  name: 'BadgeSubject',
  components: { Icon },
  props: {
    // Data
    color: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    // Supporting data
    placeholderName: {
      type: String,
      default: 'Choisir...',
    },
    // Style
    clickable: {
      type: Boolean,
      default: false,
    },
    multiline: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'badge',
    },
    thin: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    noTooltip: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    backgroundColor() {
      return this.color || 'var(--black)'
    },
    subjectNameColor() {
      return this.color ? this.textColor()(this.color) : 'var(--white)'
    },
    element() {
      return this.clickable ? 'button' : 'span'
    },
    tooltipContent() {
      if (this.noTooltip) return null
      return this.name || this.placeholderName
    },
  },
  methods: {
    ...mapGetters(['textColor']),
  },
}
</script>

<style lang="stylus" scoped>
//
//Definitions
//
badge-aspect()
  //==== Positioning
  align-items center
  //==== Spacing
  padding 0.7em
  //==== Decorations
  border-radius var(--border-radius)

dot-aspect()
  //==== Definitions
  size = 1.2em

  //==== Positioning
  display flex
  flex-shrink 0
  justify-content center
  align-items center
  min-width size / 2
  min-height size / 2
  width size
  //==== Sizing
  height size
  //==== Decoration
  border-radius 50%

  //==== Appearance
  .name
    display none

//
//Layout
//
.subject
  position relative
  //==== Positioning
  display block
  //==== Appearance
  overflow hidden
  //==== Sizing
  max-height 25vh

//
//Decoration
//
.subject
  appearance none

//
//Colors
//
.unknown-icon
  color var(--white)

//
//Typography
//
.subject
  text-overflow ellipsis
  font-weight normal

  &:not(.multiline)
    flex-shrink 0
    white-space nowrap

  &.multiline
    white-space wrap

//
//States
//
[data-variant=badge]
  badge-aspect()

  &.thin
    padding 0.3em 0.5em

[data-variant=dot]
  dot-aspect()

[data-variant=pill]
  badge-aspect()
  size = 1.5em

  display flex
  flex-shrink 1
  align-items center
  height size
  border-radius size

[data-variant=responsive]
  @media (max-width: 650px)
    badge-aspect()

  @media (min-width: 651px)
    dot-aspect()

.inline
  display inline-flex
  padding 0
  padding-bottom -0.5em
  width 1em
  height 1em

.clickable
  &:focus, &:hover
    outline none
    opacity 0.75
</style>
