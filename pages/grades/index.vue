<template lang="pug">
  div.container
    TheHeading Notes
    MainGroup
      MainGroupLeft
        HeadingSub Contrôles prévus
        ul.due-tests.tests
          li(v-for="test in dueTests", :key="test.uuid" v-if="test.grades.length") 
            ItemGrade(v-bind="test", :editable-fields="['goal', 'maximum', 'weight', 'expected']" :disabled-fields="['actual']")
      MainGroupRight
        HeadingSub Contrôles rendus
        ul.done-tests.tests
          li(v-for="test in pastTests", :key="test.uuid" v-if="test.grades.length && !test.grades[0].actual") 
            ItemGrade(v-bind="test", :editable-fields="['goal', 'maximum', 'weight', 'expected', 'actual']")

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import TheHeading from "~/components/TheHeading.vue";
import ArrayButtonFlat from "~/components/ArrayButtonFlat.vue";
import ButtonFlat from "~/components/ButtonFlat.vue";
import MainGroup from "~/components/MainGroup.vue";
import MainGroupLeft from "~/components/MainGroupLeft.vue";
import MainGroupRight from "~/components/MainGroupRight.vue";
import HeadingSub from "~/components/HeadingSub.vue";
import HeadingAlt from "~/components/HeadingAlt.vue";
import ItemGrade from "~/components/ItemGrade.vue";
import moment from "moment";

export default {
  components: {
    TheHeading,
    ArrayButtonFlat,
    ButtonFlat,
    MainGroup,
    MainGroupLeft,
    MainGroupRight,
    HeadingSub,
    HeadingAlt,
    ItemGrade
  },

  head() {
    return {
      title: `${this.fmtExercisesDueCount}Moyennes & notes`
    };
  },

  computed: {
    ...mapGetters({
      dueTests: "homework/dueTests",
      pastTests: "homework/pastTests",
      pendingExercises: "homework/pendingExercises"
    }),
    fmtExercisesDueCount() {
      if (this.pendingExercises.length)
        return `(${this.pendingExercises.length}) `;
      return "";
    }
  }
};
</script>

<style lang="stylus" scoped>
.HeadingSub {
  margin-top: 10px;
}

.tests {
  margin-top: 20px;
}
</style>