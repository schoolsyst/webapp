<template lang="pug">
  .container.-sideby-side
    .mutations-area
      HeadingSub Cours supprimés / reportés
      ul.mutations
        li.new: ButtonNormal Nouveau cours reporté ou supprimé
        li(v-for="mutation in mutations" :key="mutation.uuid")
          CardMutation(v-bind="mutation")
    .schedule
      HeadingSub Emploi du temps
      Schedule(:events="events")
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { getUnixTime, addDays } from 'date-fns'
import Schedule from '~/components/Schedule.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import CardMutation from '~/components/CardMutation.vue'
export default {
  components: { Schedule, HeadingSub, ButtonNormal, CardMutation },
  head: {
    title: 'Emploi du temps'
  },
  computed: {
    ...mapState(['now']),
    ...mapGetters('schedule', ['mutations']),
    scheduleDate() {
      return this.now
    },
    events() {
      return this.coursesIn()(
        this.scheduleDate,
        addDays(this.scheduleDate, 7)
      ).map((event) => ({
        ...event,
        start: getUnixTime(event.start),
        end: getUnixTime(event.end),
        week_type: 'BOTH'
      }))
    }
  },
  async mounted() {
    await this.$store.dispatch('schedule/load')
  },
  methods: {
    ...mapGetters('schedule', ['coursesIn'])
  }
}
</script>

<style lang="stylus" scoped>
.schedule
  overflow-x: auto
  // Cheap hack, if overflow-x is auto, overflow-y becomes either auto or scroll.
  // See: https://stackoverflow.com/a/39554003
  padding-bottom: 500px

h2
  margin-bottom: 1em
</style>
