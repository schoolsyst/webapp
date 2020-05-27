<template>
  <component :is="`h${level}`"><slot></slot></component>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
import { isHeadingLevel } from '~/utils/validators'

export default Vue.extend({
  props: {
    level: {
      type: Number,
      required: true,
      validator: isHeadingLevel,
    } as PropOptions<Number>,
  },
})
</script>
