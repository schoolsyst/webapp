<template lang="pug">

//-
  COMPONENT TREE
  Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)
  And modals

  ArrayButtonFlat
    ButtonFlat ×4
  MainGroup
    MainGroupLeft
      HeadingSub
      CardCourseUpcoming
      HeadingSub
      CardHomeworkUpcoming
    MainGroupRight
      HeadingSub
      BigNumber
      HeadingSub
      BigNumber

.container
  ModalAddNote(:subject="currentCourseSubject")
  ModalAddExercise(:subject="currentCourseSubject")
  ModalAddTest(:subject="currentCourseSubject")

  TheHeading
    | {{now.format('dddd D MMM').capFirstChar()}}
    // Will be commented until the hour is refreshed, cuz it's missleading rn
      | &mdash;{{now.format('HH')}}
      span.anim--blink :
      | {{now.format('mm')}}
  ArrayButtonFlat
    ButtonFlat(
      icon='edit', 
      open-modal="add-exercise", 
      open-at="center"
    ) Devoir
    ButtonFlat.nomobile(
      icon='note_add', 
      open-modal="add-note", 
      open-at="self"
    ) Nouveau chapitre
    ButtonFlat(
      icon='format_list_bulleted'
      open-modal="add-test",
      open-at="center"
    ) Contrôle
    ButtonFlat.nomobile(icon='insert_drive_file') Dernier chapitre
  MainGroup
    MainGroupLeft
      template(v-if="currentCourse || upcomingCourse")
        HeadingSub cours suivant
        template(v-if='upcomingCourse')
          CardCourseUpcoming(v-bind='upcomingCourse')
          //TODO: make upcomingCourseHomework getter
          template(v-if='upcomingCourse.homework')
            HeadingSub devoirs du cours suivant
            CardHomework(v-bind='homework', v-for='(homework, i) in upcomingCourse.homework', :key='i')
          CardEmpty(v-else) 👌
        CardEmpty(v-else) C'est bientôt fini 😉
      template(v-else)
        HeadingSub(has-inline-buttons)
          | Devoirs de la semaine
          ArrayButtonFlat(inline)
              ButtonFlat(icon="arrow_forward")
                nuxt-link.goto-homework(to="/homework") Voir tout
    MainGroupRight
      HeadingSub moyenne
      BigNumber(v-bind="globalMean")
      HeadingSub Évolution
      BigNumber(v-bind="evolution")
  </template>

<script>
import axios from "axios";
import moment from "moment";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import TheHeading from "~/components/TheHeading.vue";
import ArrayButtonFlat from "~/components/ArrayButtonFlat.vue";
import ButtonFlat from "~/components/ButtonFlat.vue";
import MainGroup from "~/components/MainGroup.vue";
import MainGroupLeft from "~/components/MainGroupLeft.vue";
import MainGroupRight from "~/components/MainGroupRight.vue";
import HeadingSub from "~/components/HeadingSub.vue";
import BigNumber from "~/components/BigNumber.vue";
import CardCourseUpcoming from "~/components/CardCourseUpcoming.vue";
import CardHomework from "~/components/CardHomework.vue";
import CardEmpty from "~/components/CardEmpty.vue";
import ModalAddExercise from "~/components/ModalAddExercise.vue";
import ModalAddNote from "~/components/ModalAddNote.vue";
import ModalAddTest from "~/components/ModalAddTest.vue";

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
    CardCourseUpcoming,
    CardHomework,
    CardEmpty,
    ModalAddNote,
    ModalAddExercise,
    ModalAddTest
  },

  async fetch({ app, store }) {
    let res;

    res = await app.$axios.get("/events/");
    store.commit("schedule/SET_EVENTS", res.data);

    res = await app.$axios.get("/settings/");
    store.commit("SET_SETTINGS", res.data);

    res = await app.$axios.get("/event-additions/");
    store.commit("schedule/SET_ADDITIONS", res.data);

    res = await app.$axios.get("/event-deletions/");
    store.commit("schedule/SET_DELETIONS", res.data);
  },

  data() {
    moment.locale("fr");
    return {
      addExerciseModal: false,
      now: moment()
    };
  },

  computed: {
    ...mapGetters({
      upcomingCourse: "schedule/upcomingCourse",
      currentCourse: "schedule/currentCourse",
      currentCourseSubject: "schedule/currentCourseSubject",
      setting: "schedule/setting",
      getGlobalMean: "homework/globalMean"
    }),
    //TODO: get globalMean from a getter
    globalMean() {
      let gradeMax = Number(this.setting("default_max"));
      return {
        value: this.getGlobalMean || NaN,
        unit: `/${gradeMax}`
      };
    },
    //TODO: evolution calculations
    evolution() {
      return {
        value: NaN,
        unit: "%"
      };
    }
    /* currentCourse() {
      return this.$store.getters['schedule/upcomingCourse']
    }, */
  },

  created() {
    String.prototype.capFirstChar = function() {
      return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
    };
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.TheHeading span.anim--blink
  position: relative
  top: -.1em
+mobile
  .nomobile
    display: none
.ArrayButtonFlat
  display: grid
  grid-gap: 20px
  +mobile
    grid-template-columns: repeat(2, max-content)
</style>
