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
    MainGroupRight
      HeadingAlt(has-inline-buttons) Contrôles
        ButtonFlat(open-modal="add-test", open-at="center" icon="add" inline large-icon)
      ArrayButtonFlat
        DropdownFlat(
          :options="sortingOptions"
          icon="sort"
          v-model="sortBy"
        )

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
import DropdownFlat from "~/components/DropdownFlat.vue";
import ModalAddExercise from "~/components/ModalAddExercise.vue";
import ModalAddTest from '~/components/ModalAddTest.vue'

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
    ModalAddTest
  },

  async fetch({ store, app }) {
    let subjects = store.getters.subjects;
    let res

    res = await app.$axios.get("/subjects/");
    store.commit("SET_SUBJECTS", res.data);

    res = await app.$axios.get('/settings/')
    store.commit('SET_SETTINGS', res.data)

    res = await app.$axios.get("/events/");
    store.commit("schedule/SET_EVENTS", res.data);
  },

  data() {
    return {
      sortBy: "due",
      sortingOptions: [
        { value: "due", name: "Date due" },
        { value: "created", name: "Date d'ajout" }
      ]
      // API DATA
    };
  },

  computed: {
    ...mapGetters({
      subjects: "subjects",
      currentCourseSubject: "schedule/currentCourseSubject",
    })
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
[modal-open^="add"]
    margin-left: 70px

</style>

