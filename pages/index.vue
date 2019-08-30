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
    ButtonFlat.nomobile(
      icon='insert_drive_file',
      @click.native="openCurrentSubjectLatestNote",
      :class="{'disabled': !currentCourse}"
    ) Dernier chapitre
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
        CardEmpty(v-else) Plus que {{ timeTilEndOfCurrentCourse }} !
      template(v-else)
        HeadingSub(has-inline-buttons)
          | Devoirs de la semaine
          ArrayButtonFlat(inline)
              ButtonFlat(icon="arrow_forward")
                nuxt-link.goto-homework(to="/homework") Voir tout
        ArrayGroupedHomework(:groups="groupedHomework")
    MainGroupRight
      HeadingSub moyenne
      BigNumber(v-bind="globalMean")
      HeadingSub Évolution
      BigNumber(v-bind="evolution")
  </template>

<script>
import axios from "axios";
import moment from "moment";
import groupBy from 'lodash.groupby';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
//-------------------------------------------------------
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
import ArrayGroupedHomework from '~/components/ArrayGroupedHomework.vue'

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
    ModalAddTest,
    ArrayGroupedHomework
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
      getGlobalMean: "homework/globalMean",
      groupedHomework: "homework/groupedHomework",
      notesOf: "notes/notesOf"
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
    },
    timeTilEndOfCurrentCourse() {
      return moment().to(moment(this.currentCourse.end, 'hh:mm'), true)
    },
  },

  methods: {
    openCurrentSubjectLatestNote() {
      if (!this.currentCourse) return

      let notesByModDate = this.notesOf(this.currentCourseSubject.slug).sort(
        (a, b) => moment(a.last_modified, 'YYYY-MM-DD[T]hh:mm').isBefore(moment(b.last_modified, 'YYYY-MM-DD[T]hh:mm')) ? 1 : -1
      )
      if (notesByModDate.length) {
        this.$router.push(`/notes/${notesByModDate[0].uuid}`)
      } else {
        this.$toast.error(`Aucune prise de note de ${this.currentCourseSubject.name} trouvée`)
      }
    }
  },

  created() {
    String.prototype.capFirstChar = function() {
      return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
    };
  },

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