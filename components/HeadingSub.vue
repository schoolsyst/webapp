<template>
  <h2 class="HeadingSub" :class="{'has-inline-buttons': hasInlineButtons}">
    <slot></slot>
  </h2>
</template>

<script>
export default {
  name: "HeadingSub",

  props: {
    hasInlineButtons: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  computed: {},

  created() {},

  methods: {}
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.HeadingSub 
  text-transform: uppercase
  font-weight: bold
  letter-spacing: 0.09em
  margin-top: 60px

+desktop
  .HeadingSub.has-inline-buttons 
    display: inline-flex
    align-items: center
    white-space: nowrap
+mobile
  .HeadingSub.has-inline-buttons > *
    margin-top: 10px
</style>