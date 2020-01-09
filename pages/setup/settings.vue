<template lang="pug">
.container
  ul.settings
    li(v-for="setting in settings" :key="setting.uuid")
      InputSetting(v-bind="setting")
  .bottom-bar
      ButtonNormal.go-back(variant="text-blue" href="/setup/subjects")
        Icon arrow_back
        | Retour
      .progress 2 #[span.slash /] 3
      ButtonNormal.continue(variant="primary" href="/setup/schedule") Continuer
</template>

<script>
import Icon from '~/components/Icon.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import InputSetting from '~/components/InputSetting.vue'
import { mapGetters } from 'vuex';

export default {
  components: { Icon, ButtonNormal, InputSetting },
  layout: 'bare',
  computed: {
    ...mapGetters('settings', ['all']),
    settings() {
      return this.all.filter(s => !s.optional && !s.hidden && s.category != 'Emploi du temps')
    }
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('settings/load')
    })
  }
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
ul.settings li
  margin-bottom 1em
</style>
