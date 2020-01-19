<template lang="pug">
.container
  ModalDialogConfirm(
    confirm-text="Plus tard"
    cancel-text="Configurer l'emploi du temps"
    name="skip"
    @confirm="skip"
  )
    p
      | Si vous passez cette étape, de nombreuses fonctionnalités ne seront pas disponibles:
      ul
        li Temps restant dans le cours actuel
        li Timeline
        li Sélection de date intelligente pour les devoirs
    p Vous pouvez toujours rajouter l'emploi du temps plus tard.
  h1 Votre emploi du temps
  ul.settings
    li(v-for="setting in settings" :key="setting.uuid")
      InputSetting(v-bind="{...setting, _key: setting.key}")
  TheBottomBar
    ButtonNormal(variant="text-blue" href="/setup/subjects") #[Icon arrow_back] Retour
    ButtonNormal.to-right(variant="outline" @click="$modal.open('confirm-skip')" ) Passer
    ButtonNormal(variant="primary" href="/setup/schedule/events") Continuer
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ModalDialogConfirm from '~/components/ModalDialogConfirm.vue'
import TheBottomBar from '~/components/TheBottomBar.vue'
import Icon from '~/components/Icon.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import InputSetting from '~/components/InputSetting.vue'

export default {
  components: {
    Icon,
    ButtonNormal,
    InputSetting,
    TheBottomBar,
    ModalDialogConfirm
  },
  layout: 'bare',
  computed: {
    ...mapGetters('settings', ['all']),
    settings() {
      return this.all.filter(
        (s) => !s.optional && !s.hidden && s.category === 'Emploi du temps'
      )
    }
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('settings/load')
    })
  },
  methods: {
    ...mapActions({
      setSetting: 'settings/setValue'
    }),
    async skip() {
      await this.setSetting({ key: 'use_schedule', value: 'false' })
      this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
  margin-bottom: 100px // scroll space needed because of <TheBottomBar>

h1
  margin-bottom: 1em
  text-align: center

ul.settings
  li
    margin-bottom: 1em
</style>
