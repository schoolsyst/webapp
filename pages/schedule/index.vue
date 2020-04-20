<template lang="pug">
  .container.-sideby-side
    //- .mutations-area
    //-   HeadingSub Cours supprimés / reportés
    //-   ul.mutations
    //-     li.new: ButtonNormal Nouveau cours reporté ou supprimé
    //-     li(v-for="mutation in mutations" :key="mutation.uuid")
    //-       CardMutation(v-bind="mutation")
    .schedule
      .heading
        HeadingSub Emploi du temps
        ButtonNormal(small variant="outline" href="/setup/schedule/events") Modifier
      Schedule(:events="events" read-only)
</template>

<script>
import { mapGetters, mapState } from 'vuex'
// eslint-disable-next-line no-unused-vars
import { getUnixTime, addDays, parse, format } from 'date-fns'
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
        start: getUnixTime(
          parse(format(event.start, 'HH:mm:ss'), 'HH:mm:ss', new Date(0))
        ),
        end: getUnixTime(
          parse(format(event.end, 'HH:mm:ss'), 'HH:mm:ss', new Date(0))
        )
      }))
    }
  },
  async mounted() {
    await this.$store.dispatch('schedule/load')
  },
  methods: {
    ...mapGetters('schedule', ['coursesIn', 'events'])
  }
}
</script>

<style lang="stylus" scoped>
.schedule
  overflow-x: auto
  // Cheap hack, if overflow-x is auto, overflow-y becomes either auto or scroll.
  // See: https://stackoverflow.com/a/39554003
  padding-bottom: 500px
  display flex
  flex-direction column
  align-items center

.schedule .heading
  margin-bottom 2em

h2
  margin-bottom: 1em
</style>
