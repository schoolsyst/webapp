<template lang="pug">
.container
    MainGroup
        MainGroupLeft
            TheHeading {{date}}
            p.heading-detail 
                | Semaine du {{format(startOfWeek(scheduleNow), 'd/M')}} 
                | au {{format(endOfWeek(scheduleNow), 'd/M')}} 
                | ({{weekType}})
            HeadingSub Cours reportés & supprimés
            ButtonLargeFlat.new-mutation Nouvelle modification…
        MainGroupRight
            Schedule(:now="scheduleNow")
</template>

<script>
import moment from "moment"
import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
import { format, startOfWeek, endOfWeek } from 'date-fns'
//-------------------------------------------------------------------
import TheHeading from "~/components/TheHeading.vue"
import ArrayButtonFlat from "~/components/ArrayButtonFlat.vue"
import ButtonFlat from "~/components/ButtonFlat.vue"
import MainGroup from "~/components/MainGroup.vue"
import MainGroupLeft from "~/components/MainGroupLeft.vue"
import MainGroupRight from "~/components/MainGroupRight.vue"
import HeadingSub from "~/components/HeadingSub.vue"
import ArrayItemScheduleMutation from "~/components/ArrayItemScheduleMutation.vue"
import ItemScheduleMutation from "~/components/ItemScheduleMutation.vue"
import BarFloating from "~/components/BarFloating.vue"
import EventSchedule from "~/components/EventSchedule.vue"
import ButtonLargeFlat from "~/components/ButtonLargeFlat.vue"
import Schedule from "~/components/Schedule.vue"

export default {
  components: {
    TheHeading,
    ArrayButtonFlat,
    ButtonFlat,
    MainGroup,
    MainGroupLeft,
    MainGroupRight,
    HeadingSub,
    ArrayItemScheduleMutation,
    ItemScheduleMutation,
    BarFloating,
    EventSchedule,
    ButtonLargeFlat,
    Schedule,
  },

  head() {
    return {
      title: `${this.pageTitleCounter}Emploi du temps`,
    }
  },

  data() {
    return {
      scheduleNow: new Date(),
      now: moment(),
      //TODO: dynamically determine PX_PER_MIN & EVENT_WIDTH to fit neatly into 100vh & 2/3*100vw
    }
  },

  computed: {
    ...mapGetters({
      getWeekType: "schedule/weekType",
      pageTitleCounter: "homework/pageTitleCounter",
    }),
    weekType() {
      return this.getWeekType()
    },
    date() {
      moment.locale("fr")
      let fmt = moment().format("dddd")
      return fmt.charAt(0).toUpperCase() + fmt.substr(1)
    },
  },

  methods: { format, startOfWeek, endOfWeek }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.heading-detail
    font-size: 24px
.HeadingSub 
    margin-right: 50px
    font-size: 24px
.Schedule
    width: 100%
+desktop
    .MainGroup
        grid-template-columns: 2fr 3fr
</style>

