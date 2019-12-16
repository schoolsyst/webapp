<template lang="pug">
  .container.-sideby-side
    .mutations-area
      HeadingSub Cours supprimés / reportés
      ul.mutations
        li.new: ButtonNormal Nouveau cours reporté ou supprimé
        li(v-for="mutation in mutations" :key="mutation.uuid")
          | {{ mutation }}
    .schedule
      HeadingSub Emploi du temps
      Schedule(:now="scheduleDate")
</template>

<script>
import Schedule from '~/components/Schedule.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import { mapGetters, mapState } from 'vuex'
export default {
  components: { Schedule, HeadingSub, ButtonNormal },
  head: {
    title: 'Emploi du temps'
  },
  computed: {
    ...mapState(['now']),
    ...mapGetters('schedule', ['mutations']),
    scheduleDate() {
      return this.now
    }
  },
  async mounted() {
    await this.$store.dispatch('schedule/load')
  }
}
</script>

<style lang="stylus" scoped>
.schedule
  overflow-x auto
  // Cheap hack, if overflow-x is auto, overflow-y becomes either auto or scroll.
  // See: https://stackoverflow.com/a/39554003
  padding-bottom 500px 
h2
  margin-bottom 1em
</style>
