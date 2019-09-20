<template lang="pug">
//- The "groups" array should be structured as such:
    "groups": [
        [
            "YYYY-MM-DD", // Date due
            {
                exercises: [{...}, {...}, ...], // exercises due for this date
                tests: [{...}, {...}, ...] // tests due for this date
            }
        ],
        [ ... ]
    ]
ul.ArrayGroupedHomework
    li(v-for="(group, i) in groups" :key="i")
        //TODO: showThisGroup as a computed property, separate into a component "GroupedHomework"
        HeadingSub(v-if="showThisGroup(group) && showHeaders")
            span.date {{ formatDate(group[0]) }}
            span.sep(v-if="formatDate(group[0])") &mdash;
            span.delta {{ formatDelta(group[0]) }}
        ArrayItemExercise(v-if="show === 'exercises' || show === 'both'")
            ItemExercise(
                v-for="(exercise, i) in group[1].exercises" :key="i" 
                v-bind="exercise",
                :show-completed="showCompleted",
                :mnml="mnmlMode"
            )
        ArrayCardTest(v-if="show === 'tests' || show === 'both'")
            CardTest(
                v-for="(test, i) in group[1].tests" :key="i", 
                v-bind="test",
            )
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
//--------------------------
import ArrayCardTest from "~/components/ArrayCardTest.vue";
import ArrayItemExercise from "~/components/ArrayItemExercise.vue";
import HeadingSub from "~/components/HeadingSub.vue";
import ItemExercise from "~/components/ItemExercise.vue";
import CardTest from "~/components/CardTest.vue";

export default {
  name: "ArrayGroupedHomework",
  components: {
    ArrayCardTest,
    ArrayItemExercise,
    HeadingSub,
    CardTest,
    ItemExercise
  },
  props: {
    groups: Array,
    show: {
      type: String,
      default: "both"
    },
    showCompleted: Boolean,
    showHeaders: {
        type: Boolean,
        default: true
    }
  },
  computed: {
    ...mapGetters({
      setting: "setting"
    }),
    mnmlMode() {
      return this.setting("mnml_mode") === "true";
    }
  },
  methods: {
    formatDate(date) {
      moment.locale("fr");
      let m = moment(date);
      let dayFmt;
      if (m.isBefore(moment())) {
        dayFmt = "En retard";
      }
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
      let daysDiff = m.diff(moment(), "days");
      return daysDiff >= 3 && daysDiff !== 7
        ? m.format(dayFmt).replace(".", "")
        : "";
    },
    formatDelta(date) {
      moment.locale("fr");
      let m = moment(date);
      if (m.date() === moment().date()) {
        return "Bientôt";
      } else if (
        m.diff(moment(), "hours") >= 12 &&
        m.diff(moment(), "hours") <= 24
      ) {
        return "Demain";
      }
      return m
        .fromNow(true)
        .replace(/\d+ [hH]eures?/, "demain")
        .replace("un jour", "demain")
        .replace("2 jours", "après-demain")
        .replace("7 jours", "dans une semaine");
    },
    showThisGroup(group) {
      let completedExercisesLength = group[1].exercises
        ? group[1].exercises.filter(ex => !ex.completed).length
        : 0;
      console.log(completedExercisesLength);
      let testsLength = group[1].tests ? group[1].tests.length : 0;

      let type =
        (this.show === "exercises" && group[1].exercises) ||
        (this.show === "tests" && group[1].tests) ||
        this.show === "both";
      let done =
        this.showCompleted || completedExercisesLength + testsLength > 0;
      return type && done;
    }
  }
};
</script>

<style lang="sass" scoped>
.ArrayCardTest, .ArrayItemExercise 
  // ---   spacing    ---
  margin-top: 10px


.HeadingSub
  // ---   spacing    ---
  margin-top: 30px

</style>