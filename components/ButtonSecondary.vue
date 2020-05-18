<template>
  <base-button v-bind="{ ...$props }" class="--button-secondary">
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
.--button-secondary
  padding 0.8em 1.4em

.small
  padding 0.5em 0.7em

//
//Decoration
//
.--button-secondary
  border 2px solid
  border-radius var(--border-radius)

//
//Colors
//
.--button-secondary
  border-color var(--grey)
  color var(--blue)

//
//Typography
//

//
//States
//
:hover, :focus
  border-color var(--blue)
  color var(--blue-dark)

:active
  border-color var(--blue-dark)
  background-color var(--blue-offset)
</style>
