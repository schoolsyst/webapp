<template lang="pug">
//- COMPONENT TREE
  Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

  MainGroup
      MainGroupLeft
          HeadingAlt
              ArrayButtonFlat
                  ButtonFlat
          ArrayButtonFlat
              CheckboxFlat
          HeadingSub
              ItemExercise
      MainGroupRight
          HeadingAlt
              ArrayButtonFlat
                  ButtonFlat
          HeadingSub
              CardTest


.container
  ModalAddExercise(:subject="currentCourseSubject")
  ModalAddTest(:subject="currentCourseSubject")

  TheHeading Devoirs
  MainGroup
    MainGroupLeft
      //-FIXME: &nbsp = Cheap hack to align both plus signs on mobile, should do proper alignement
      HeadingAlt(has-inline-buttons) Exercices&nbsp;
        ButtonFlat(open-modal="add-exercise", open-at="center" icon="add" inline large-icon)
      ArrayButtonFlat
        li
          input(type="checkbox", v-model="showCompleted")#field_show-completed
          label(for="field_show-completed") Voir les exercices terminés
      ArrayGroupedHomework
    MainGroupRight
      HeadingAlt(has-inline-buttons) Contrôles
        ButtonFlat(open-modal="add-test", open-at="center" icon="add" inline large-icon)
      ArrayButtonFlat
        li: DropdownFlat(
          :options="sortingOptions"
          icon="sort"
          v-model="sortBy"
        )
      ArrayGroupedHomework

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
import groupBy from "lodash.groupby"
import moment from "moment"
//-----------------------------------------------
import TheHeading from "~/components/TheHeading.vue"
import ArrayButtonFlat from "~/components/ArrayButtonFlat.vue"
import ButtonFlat from "~/components/ButtonFlat.vue"
import MainGroup from "~/components/MainGroup.vue"
import MainGroupLeft from "~/components/MainGroupLeft.vue"
import MainGroupRight from "~/components/MainGroupRight.vue"
import HeadingSub from "~/components/HeadingSub.vue"
import HeadingAlt from "~/components/HeadingAlt.vue"
import DropdownFlat from "~/components/DropdownFlat.vue"
import ModalAddExercise from "~/components/ModalAddExercise.vue"
import ModalAddTest from "~/components/ModalAddTest.vue"
import ArrayGroupedHomework from "~/components/ArrayGroupedHomework.vue"

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
    DropdownFlat,
    ModalAddExercise,
    ModalAddTest,
    ArrayGroupedHomework,
  },

  head() {
    return {
      title: `${this.pageTitleCounter}Devoirs`,
    }
  },

  fetch({store}) {
    store.dispatch('homework/load')
  },

  data() {
    return {
      sortBy: "due",
      sortingOptions: [
        { value: "due", name: "Date due" },
        { value: "created", name: "Date d'ajout" },
      ],
      showCompleted: true,
      // API DATA
    }
  },

  computed: {
    ...mapGetters({
      subjects: "subjects/all",
      currentCourse: "schedule/currentCourse",
      courseOrPlaceholder: "schedule/courseOrPlaceholder",
    }),
    currentCourseSubject() {
      return this.courseOrPlaceholder(this.currentCourse).subject
    }
  },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
[modal-open^="add"]
    margin-left: 70px
.MainGroupRight
  +tablet
    margin-right: 20px
</style>

