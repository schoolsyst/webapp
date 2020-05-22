<template>
  <component
    :is="tagName"
    :class="{ '--base-button': true, dangerous, small }"
    :href="href"
    @click="handleClick"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  props: {
    dangerous: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    small: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    href: {
      type: String,
      default: null,
    } as PropOptions<string | null>,
  },
  computed: {
    tagName(): string {
      return this.href ? 'a' : 'button'
    },
  },
  methods: {
    handleClick(): void {
      if (!this.href) {
        this.$emit('click')
      }
    },
  },
})
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

//
//Decoration
//
.--base-button::-moz-focus-inner
  border 0

.--base-button
  outline 0

//
//States
//
[disabled]
  cursor not-allowed
</style>
