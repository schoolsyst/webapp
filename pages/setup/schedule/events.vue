<template lang="pug">
  .container
    // TODO(beta-1.0.0): modify events
    ModalAddEvent(
      v-model="addingEvent"
      @submit="postEvent({event: addingEvent})"
      action="add"
    )
    h1 Rentrez votre emploi du temps
    .schedule
      ButtonNormal.add(variant="outline" @click="$modal.show('add-event')") Ajouter
      Schedule(both-weeks)
    TheBottomBar
      ButtonNormal(variant="text-blue" href="/setup/schedule/settings") #[Icon arrow_back] Retour
      ButtonNormal.to-right(variant="primary" href="/") Terminer
</template>

<script>
import { mapActions } from 'vuex'
import TheBottomBar from '~/components/TheBottomBar.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import ModalDialogConfirm from '~/components/ModalDialogConfirm.vue'
import Schedule from '~/components/Schedule.vue'
import ModalAddEvent from '~/components/ModalAddEvent.vue'
import Icon from '~/components/Icon.vue'
import InputSetting from '~/components/InputSetting.vue'

export default {
  components: {
    ButtonNormal,
    Schedule,
    ModalAddEvent,
    Icon,
    InputSetting,
    ModalDialogConfirm,
    TheBottomBar
  },
  layout: 'bare',
  data() {
    const defaults = {
      subject: null,
      week_type: 'BOTH',
      day: null,
      start: null,
      end: null,
      room: null,
      identifier$action: 'add'
    }
    return {
      addingEvent: defaults
    }
  },
  computed: {
    settings() {
      return this.$store.getters['settings/fromCategory']('Emploi du temps')
    }
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('subjects/load')
      await this.$store.dispatch('settings/load')
      await this.$store.dispatch('schedule/load')
    }, 'Veuillez patienter...')
  },
  methods: {
    ...mapActions('schedule', ['postEvent', 'validateEvent'])
  }
}
</script>

<style lang="stylus" scoped>
.container
  padding: 2em

h1
  text-align: center
  margin-bottom: 1em

.-side-by-side > *:first-child
  border-right: 2px solid var(--grey-light)

ul.settings
  li
    margin-bottom: 2em

.schedule .add
  display: flex
  justify-content: center
  margin-bottom: 3em

.schedule
  // Compensate for the bottom bar
  margin-bottom: 96px
</style>
