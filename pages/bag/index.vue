<template lang="pug">
  .container
    TheHeading Sac
    ArrayButtonFlat
    MainGroup
      MainGroupLeft
        HeadingSub À ajouter
        ul.subjects.toadd
          li(v-for="subject in subjectsToAdd")
            SubjectDot(v-if="mnml" v-bind="subject")
            BadgeSubject(v-else v-bind="subject")
        HeadingSub À enlever
        ul.subjects.toremove
          li(v-for="subject in subjectsToRemove")
            SubjectDot(v-if="mnml" v-bind="subject")
            BadgeSubject(v-else v-bind="subject")
      MainGroupRight
        HeadingSub Journée de demain
        BigNumber(:value="tomorrowHoursCount" unit="heures" sign="~")
        //TODO: Time of start & end of day
    
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import TheHeading       from "~/components/TheHeading.vue";
import ArrayButtonFlat  from "~/components/ArrayButtonFlat.vue";
import ButtonFlat       from "~/components/ButtonFlat.vue";
import MainGroup        from "~/components/MainGroup.vue";
import MainGroupLeft    from "~/components/MainGroupLeft.vue";
import MainGroupRight   from "~/components/MainGroupRight.vue";
import HeadingSub       from "~/components/HeadingSub.vue";
import BigNumber        from '~/components/BigNumber.vue';
import SubjectDot from '~/components/SubjectDot.vue';
import BadgeSubject from '~/components/BadgeSubject.vue';

export default {
  components: {
    TheHeading,
    ArrayButtonFlat,
    ButtonFlat,
    MainGroup,
    MainGroupLeft,
    MainGroupRight,
    HeadingSub,
    BigNumber,
    SubjectDot,
    BadgeSubject
  },

  data() {
    return {
      mnml: false
    };
  },

  computed: {
    ...mapGetters({
      subjectsToAddFor: 'schedule/subjectsToAddFor',
      subjectsToRemoveFor: 'schedule/subjectsToRemoveFor',
      hoursCountFor: 'schedule/hoursCountFor'
    }),
    subjectsToAdd() {
      return this.subjectsToAddFor(moment().add(1, 'day'))
    },
    subjectsToRemove() {
      return this.subjectsToRemoveFor(moment().add(1, 'day'))
    },
    tomorrowHoursCount() {
      return this.hoursCountFor(moment().add(1, 'day'))
    }
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

ul.subjects
  display: grid
  grid-template-columns: repeat(4, 100px)
  margin-top: 10px
  grid-gap: 15px
</style>