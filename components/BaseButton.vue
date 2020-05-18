<template>
  <tag
    :is="tagName"
    @click="handleClick"
    :class="{ '--base-button': true, dangerous, small, clicked }"
  >
    <slot></slot>
  </tag>
</template>

<script>
import { isURL } from '~/utils/validators'

export default {
  props: {
    dangerous: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    href: {
      type: String,
      default: null,
      validator: isURL,
    },
  },
  computed: {
    tagName() {
      return this.href ? 'a' : 'button'
    },
  },
  methods: {
    handleClick() {
      if (!this.href) {
        this.$emit('click')
      }
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
