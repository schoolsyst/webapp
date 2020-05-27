<template lang="pug">
  .success-wrapper#success-state(:class="{small, [`image-${image}`]: true}")
    .success
      img(:src="`/misc/${image}.svg`")
      .text
        p: slot
      .buttons
        ButtonNormal.cta(@click="$emit('cta')", variant="primary"): slot(name="cta")
        ButtonNormal.cta(v-if="$slots['cta-secondary']" @click="$emit('cta-secondary')", variant="outline"): slot(name="cta-secondary")
</template>

<script>
import ButtonNormal from '~/components/legacy/ButtonNormal.vue'

export default {
  components: { ButtonNormal },
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: 'checkmark',
    },
  },
}
</script>

<style lang="stylus" scoped>
.success-wrapper
  display flex
  justify-content center
  align-items center

.success
  display flex
  flex-direction column
  align-items center
  width 100%

.image-checkmark img
  margin-bottom -70px

.image-thumbs-up img
  margin-bottom 60px

@media (max-width: 888px)
  img
    width 70%

.text
  text-align center

&.small p
  font-size 1.2rem

&.small img
  width 300px

&.small h1
  font-size 1.6rem

.buttons
  margin-top 3rem
</style>
