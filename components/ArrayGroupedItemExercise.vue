<template lang="pug">
ul.ArrayGroupedItemExercise
  li(v-for="(group, i) in groups" :key="due")
    HeadingSub
      span.date {{ formatDate(group[0].due) }}
      span.sep(v-if="formatDate(group[0].due)") &mdash;
      span.delta {{ formatDelta(group[0].due) }}
    ArrayItemExercise
      ItemExercise(v-for="(exercise, i) in group" :key="i" v-bind="exercise")
</template>

<script>
import ArrayItemExercise from "~/components/ArrayItemExercise.vue";
import HeadingSub from "~/components/HeadingSub.vue";
import ItemExercise from "~/components/ItemExercise.vue";
import moment from "moment";

export default {
  name: "ArrayGroupedItemExercise",

  components: {
    ArrayItemExercise,
    HeadingSub,
    ItemExercise
  },
  props: {
    groups: Array
  },
  methods: {
    formatDate(date) {
      moment.locale("fr");
      let m = moment(date);
      let dayFmt;
      // don't show infos if they're close enough:
      if (m.isSame(moment(), "week")) {
        // in same week: show only the day name
        dayFmt = "dddd";
      } else if (m.isSame(moment(), "month")) {
        // in same month: show day name & day no.
        dayFmt = "dddd DD";
      } else if (m.isSame(moment(), "year")) {
        // in same year: show day name, day no. and month name (abbreviated).
        dayFmt = "dddd DD MMM";
      } else {
        // show the full thing
        dayFmt = "dddd DD MMM YYYY";
      }
      //                         thin nbsp, em-dash, thin nbsp
      return m.diff(moment(), 'days') >= 3 ? m.format(dayFmt) : '';
    },
    formatDelta(date) {
      moment.locale("fr");
      let m = moment(date);
      return m
        .fromNow(true)
        .replace("un jour", "demain")
        .replace("2 jours", "après-demain");
    }
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.ArrayItemExercise
  //--- positioning ---
  
  //--- dimensions  ---
  
  //---   margins   ---
  margin-top: 10px
  //---  appearance ---
  
  //---  animation  ---

.HeadingSub
  //--- positioning ---

  //--- dimensions  ---
  
  //---   margins   ---
  margin-top: 30px
  //---  appearance ---
  
  //---  animation  ---
</style>