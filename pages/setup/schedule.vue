<template lang="pug">
  .container
    ModalDialogConfirm(
      confirm-text="Plus tard"
      cancel-text="Configurer l'emploi du temps"
      name="skip"
      @confirm="setSetting({key: 'use_schedule', value: false}); $router.push('/')"
    )
      p
        | Si vous passez cette étape, de nombreuses fonctionnalités ne seront pas disponibles:
        ul
          li Temps restant dans le cours actuel
          li Timeline
          li Sélection de date intelligente pour les devoirs
      p Vous pouvez toujours rajouter l'emploi du temps plus tard.
      
    ModalAddEvent(@post="postEvent({event: $event})")
    h1 Rentrez votre emploi du temps
    //TODO: ↓ grtc 1fr 3fr 
    .-side-by-side 
      ul.settings
        li(v-for="setting in settings" :key="setting.uuid")
          InputSetting(v-bind="{...setting, _key: setting.key}")
      .schedule
        ButtonNormal.add(variant="outline" @click="$modal.show('add-event')") Ajouter
        Schedule
    TheBottomBar
      ButtonNormal(variant="text-blue" href="/setup/settings") #[Icon arrow_back] Retour
      ButtonNormal.to-right(variant="outline" @click="$modal.open('confirm-skip')" ) Passer
      ButtonNormal(variant="primary" href="/") Terminer
</template>

<script>
import TheBottomBar from '~/components/TheBottomBar.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import ModalDialogConfirm from '~/components/ModalDialogConfirm.vue'
import Schedule from '~/components/Schedule.vue'
import ModalAddEvent from '~/components/ModalAddEvent.vue'
import Icon from '~/components/Icon.vue'
import InputSetting from '~/components/InputSetting.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { ButtonNormal, Schedule, ModalAddEvent, Icon, InputSetting, ModalDialogConfirm, TheBottomBar },
  layout: 'bare',
  computed: {
    settings() {
      return this.$store.getters['settings/fromCategory']('Emploi du temps')
    }
  },
  methods: {
    ...mapActions('schedule', ['postEvent', 'validateEvent']),
    ...mapActions({
      setSetting: 'settings/setValue'
    })
  },
  computed() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('subjects/load')
      await this.$store.dispatch('settings/load')
    }, 'Veuillez patienter...')
  }
}
</script>

<style lang="stylus" scoped>
.container
  padding 2em
h1
  text-align center
  margin-bottom 3em
.-side-by-side > *:first-child
  border-right 2px solid var(--grey-light)
ul.settings
  li
    margin-bottom 2em
.schedule .add
  display flex
  justify-content center
</style>
