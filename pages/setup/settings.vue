<template lang="pug">
.container
  .bottom-bar
      ButtonNormal.go-back(variant="text-blue" href="/setup/subjects")
        Icon arrow_back
        | Retour
      .progress 2 #[span.slash /] 3
      ButtonNormal.continue(variant="primary" href="/setup/schedule") Continuer
</template>

<script>
import ButtonNormal from '~/components/ButtonNormal.vue'
import Icon from '~/components/Icon.vue'
import InputSetting from '~/components/InputSetting.vue'

export default {
  components: { ButtonNormal, Icon, InputSetting },
  layout: 'bare',
}
</script>

<style lang="stylus" scoped>
.bottom-bar
  padding 2em
  position fixed
  bottom: 0
  right: 0
  left: 0
  display flex
  align-items center
  .go-back
    font-size: 1.2em
  .progress
    font-family var(--fonts-monospace)
    font-size: 1.3em
    margin-left 1em
    .slash
      color var(--grey-dark)
  .continue
    margin-left auto
</style>
