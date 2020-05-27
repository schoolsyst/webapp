<template>
  <base-input
    type="text"
    :element="block ? 'textarea' : 'input'"
    v-bind="{ ...$props }"
    @input="$emit('input', $event)"
  >
    <slot></slot>
  </base-input>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
import BaseInput from '~/components/BaseInput.vue'

export default Vue.extend({
  components: { BaseInput },
  extends: BaseInput,
  props: {
    block: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
  },
})
</script>

<style lang="stylus" scoped>
//
// Definitions
//



//
// Positioning
//



//
// Sizing
//



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



//
// States
//
</style>
