<template>
  <button
    @click="handleClick"
    :class="{ '--base-button': true, disabled, dangerous, small, clicked }"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
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
  data() {
    return {
      clicked: false,
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
      this.clicked = true
      setTimeout(() => {
        this.clicked = false
      }, 100)
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
</style>
