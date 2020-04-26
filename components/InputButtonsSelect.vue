<template lang="pug">
  .switch
    ul
      li(v-for="v in values" :key="v.key")
        ButtonNormal.button(
          :value="v.key"
          @click="handleInput(v)"
          :class="{selected: value === v.key}"
          no-error-messages
        ) {{ v.label }}
</template>

<script>
import ButtonNormal from '~/components/ButtonNormal.vue'

export default {
  components: { ButtonNormal },
  props: {
    values: {
      type: Array,
      default: null,
    },
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value.key)
    },
  },
}
</script>

<style lang="stylus" scoped>
ul
  display flex
  align-items center

.button /deep/ .btn
  width 100%

li:first-child /deep/ .btn
  border-top-right-radius 0
  border-bottom-right-radius 0

li:last-child /deep/ .btn
  border-top-left-radius 0
  border-bottom-left-radius 0

li:not(:last-child) /deep/ .btn
  border-right none

li:not(:first-child):not(:last-child) /deep/ .btn
  border-radius 0

.button /deep/ .btn
  border-color var(--grey) !important

.button:hover /deep/ .btn
  color var(--blue-dark)

.button.selected /deep/ .btn
  background var(--blue-offset-dark)
  color var(--blue-dark)
</style>
