<template lang="pug">
  .empty-wrapper#empty-state
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
}
</script>

<style lang="stylus" scoped>
.empty-wrapper
  display flex
  align-items center
  justify-content center
.empty
  text-align: center
  display flex
  align-items center
  justify-content center
  flex-direction column
  .smiley
    font-size 10rem
    font-family var(--fonts-monospace)
    color var(--grey-offset-dark)
  p
    font-size 1.5rem
    margin-top 5vh
    margin-bottom .75em
</style>
