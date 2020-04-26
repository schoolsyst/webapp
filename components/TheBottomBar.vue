<template lang="pug">
  #bottom-bar: slot
</template>

<script>
export default {
  props: {
    shown: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    this.reactOnShownProp()
  },
  watch: {
    shown() {
      this.reactOnShownProp()
    },
  },
  // We can't use a computed prop because the element
  // needs to be mounted to access the DOM
  methods: {
    reactOnShownProp() {
      const { height } = this.$el.getBoundingClientRect()
      const bottom = this.shown ? 0 : -height + 'px'
      this.$el.style.bottom = bottom
    },
  },
}
</script>

<style lang="stylus" scoped>
#bottom-bar
  position fixed
  right 0
  bottom 0
  left 0
  z-index 100
  display flex
  flex-wrap wrap
  align-items center
  padding 1.5em 2em
  border-top 1px solid var(--grey)
  background var(--white)
  transition bottom 0.5s ease

  .to-right
    margin-left auto

  @media (max-width: 650px)
    font-size 0.85em
</style>
