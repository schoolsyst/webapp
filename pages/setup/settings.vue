<template lang="pug">
.container
  ul.settings
    li(v-for="setting in settings" :key="setting.uuid")
      InputSetting(v-bind="setting")
  TheBottomBar
      ButtonNormal(variant="text-blue" href="/setup/subjects") #[Icon arrow_back] Retour
      ButtonNormal.to-right(variant="primary" href="/setup/schedule/settings") Continuer
</template>

<script>
import { mapGetters } from 'vuex'
import TheBottomBar from '~/components/TheBottomBar.vue'
import Icon from '~/components/Icon.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import InputSetting from '~/components/InputSetting.vue'

export default {
  components: { Icon, ButtonNormal, InputSetting, TheBottomBar },
  layout: 'bare',
  computed: {
    ...mapGetters('settings', ['all']),
    settings() {
      return this.all.filter(
        (s) => !s.optional && !s.hidden && s.category !== 'Emploi du temps'
      )
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
ul.settings li
  margin-bottom: 1em
</style>
