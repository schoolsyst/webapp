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
    disabled: {
      type: Boolean,
      default: false,
    },
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

//
//Sizing
//

//
//Spacing
//
.--button-primary
  padding .7em 1.2em

//
//Decoration
//
.--button-primary
  border 1px solid transparent //To prevent jittering when :hover'ing
  border-radius var(--border-radius)

.disabled
  cursor not-allowed

//
//Colors
//
.--button-primary
  background-color var(--blue-offset)
  color var(--blue-dark)

.dangerous
  background-color var(--red-offset)
  color var(--red-dark)

.disabled
  background-color var(--grey-offset-dark)
  color var(--grey-dark)

//
//Typography
//

//
//Reactions
//
.--button-primary:hover, .--button-primary:focus
  border 1px solid var(--blue)
  color var(--blue)

  &.dangerous
    border-color var(--red)

  &.disabled
    border-color var(--black)

.--button-primary.clicked:not(.disabled)
  background-color var(--blue-offset-dark)
  color var(--blue-dark)
  border-color var(--blue-dark)

  &.dangerous
    background-color var(--red-offset-dark)
    color var(--red-dark)
</style>
