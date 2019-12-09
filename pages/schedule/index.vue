<template lang="pug">
  .container
    .schedule
      Schedule(:now="scheduleDate")
</template>

<script>
import Schedule from '~/components/Schedule.vue'
import { mapGetters, mapState } from 'vuex'
export default {
  components: { Schedule },
  computed: {
    ...mapState(['now']),
    scheduleDate() {
      return this.now
    }
  },
  async mounted() {
    await this.$store.dispatch('schedule/load')
  }
}
</script>
