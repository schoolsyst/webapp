<template>
  <base-button v-bind="{ ...$props }" class="--button-icon">
    <span
      :class="{
        'force-filled': filled === true,
        'force-outlined': filled === false,
        icon: true,
        'material-icons': true,
      }"
    >
      <slot></slot>
    </span>
  </base-button>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
import BaseButton from '~/components/BaseButton.vue'

export default Vue.extend({
  components: { BaseButton },
  extends: BaseButton,
  props: {
    filled: {
      type: Boolean,
      default: null,
    } as PropOptions<boolean | null>,
  },
})
</script>

<style lang="stylus" scoped>
//
//Definitions
//
fontstack-filled = 'Material Icons', sans-serif
fontstack-outlined = 'Material Icons Outlined', sans-serif

//
//Positioning
//

//
//Sizing
//

//
//Spacing
//
.--button-icon
  padding 0.5em

//
//Decoration
//

//
//Colors
//
.dangerous
  color var(--red)

[disabled]
  opacity 0.5

//
//Typography
//
.icon
  font-family fontstack-outlined

.icon.force-filled
  font-family fontstack-filled

//
//State
//
.--button-icon:hover, .--button-icon:focus
  &:not([disabled]) .icon:not(.force-outlined)
    font-family fontstack-filled

  .icon[class^=force-]
    color var(--blue)
</style>
