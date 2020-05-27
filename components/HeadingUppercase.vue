<template>
  <base-heading :level="level" class="--heading-uppercase">
    <slot></slot>
  </base-heading>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
import { isHeadingLevel } from '../utils/validators'
import BaseHeading from '~/components/BaseHeading.vue'

export default Vue.extend({
  components: { BaseHeading },
  props: {
    level: {
      type: Number,
      default: 3,
      validator: isHeadingLevel,
    } as PropOptions<number>,
  },
})
</script>

<style lang="stylus">
//
// Definitions
//



//
// Positioning
//



//
// Sizing
//

.--heading-uppercase
    font-size: 1.2em

//
// Spacing
//



//
// Decoration
//



//
// Colors
//



//
// Typography
//

.--heading-uppercase
    text-transform uppercase
    font-weight bold
    letter-spacing: 0.09em

//
// States
//
</style>
