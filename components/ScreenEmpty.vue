<template lang="pug">
  .empty
    .smiley: slot(name="smiley")
    p: slot
    ButtonNormal(@click="$emit('cta')"): slot(name="cta")
</template>

<script>
import ButtonNormal from '~/components/ButtonNormal.vue'

export default {
  components: { ButtonNormal }
}
</script>

<style lang="stylus" scoped>
.empty
  margin-top 10rem
  text-align: center
  display flex
  align-items center
  flex-direction column
  .smiley
    font-size 10rem
    font-family var(--fonts-monospace)
    color var(--grey-light)
  p
    font-size 1.5rem
    margin-top 3em
    margin-bottom .75em
</style>
