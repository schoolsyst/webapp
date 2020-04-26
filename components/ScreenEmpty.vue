<template lang="pug">
  .empty-wrapper#empty-state(:class="{small}")
    .empty
      .smiley: slot(name="smiley")
      p: slot
      .ctas
        ButtonNormal(@click="$emit('cta')"): slot(name="cta")
        ButtonNormal(v-if="$slots['cta-secondary']" @click="$emit('cta-secondary')"): slot(name="cta-secondary")
</template>

<script>
import ButtonNormal from '~/components/ButtonNormal.vue'

export default {
  components: { ButtonNormal },
  props: {
    small: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="stylus" scoped>
.empty-wrapper
  display flex
  justify-content center
  align-items center

.empty
  display flex
  flex-direction column
  justify-content center
  align-items center
  text-align center

  .smiley
    color var(--grey-offset-dark)
    font-size 10rem
    font-family var(--fonts-monospace)

  p
    margin-top 5vh
    margin-bottom 0.75em
    font-size 1.5rem

&.small p
  font-size 1.2rem
</style>
