<template>
  <base-button v-bind="{ ...$props }" class="--button-primary">
    <slot></slot>
  </base-button>
</template>

<script>
import BaseButton from '~/components/BaseButton.vue'

export default {
  components: { BaseButton },
  props: {
    dangerous: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="stylus" scoped>
//
//Definitions
//

//
//Positioning
//
.--button-primary
  display inline-block

//
//Sizing
//

//
//Spacing
//
.--button-primary
  padding 0.8em 1.4em

.small
  padding 0.5em 0.7em

//
//Decoration
//
.--button-primary
  border 1px solid transparent //To prevent jittering when :hover'ing
  border-radius var(--border-radius)

//
//Colors
//
.--button-primary
  background-color var(--blue-offset)
  color var(--blue-dark)

.dangerous
  background-color var(--red-offset)
  color var(--red-dark)

[disabled]
  background-color var(--grey-offset-dark)
  color var(--grey-dark)

//
//Typography
//

//
//Reactions
//
.--button-primary:hover, .--button-primary:focus
  border 1px solid

  &:not(.dangerous):not([disabled])
    border-color var(--blue)
    color var(--blue)

  &.dangerous:not([disabled])
    border-color var(--red)
    color var(--red)

  &[disabled]
    border-color var(--black)

  &[disabled].dangerous
    border-color var(--red)

.--button-primary:active:not([disabled])
  border-color var(--blue-dark)
  background-color var(--blue-offset-dark)
  color var(--blue-dark)

  &.dangerous
    background-color var(--red-offset-dark)
    color var(--red-dark)
</style>
