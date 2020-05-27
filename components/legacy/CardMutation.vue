<template lang="pug">
.card(:class="`type-${type}`")
    .header
        span.event 
            | Cours de 
            BadgeSubject(v-bind="subject" variant="pill")
            span.subject-name {{ subject.name }}
            | du 
            span.date {{ date }}
            | de 
            //-span.time.start {{ formatTime(m.event.start) }}
            | à
            //-span.time.end {{ formatTime(m.event.end) }}

</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import BadgeSubject from '~/components/legacy/BadgeSubject.vue'

export default {
  components: { BadgeSubject },
  props: {
    uuid: String,
  },
  computed: {
    m() {
      const m = this.mutation()(this.uuid)
      console.log(m)
      return m
    },
    type() {
      return this.m.type
    },
    subject() {
      return this.m.subject
    },
    date() {
      return this.formatDate(this.$store.state.now)
    },
  },
  methods: {
    ...mapGetters('schedule', ['mutation']),
    formatDate(date) {
      return format(date, 'ccc dd MMM', { locale: fr })
    },
    formatTime(date) {
      return format(date, 'HH:mm', { locale: fr })
    },
  },
  async mounted() {
    await this.$store.dispatch('schedule/load')
  },
}
</script>
