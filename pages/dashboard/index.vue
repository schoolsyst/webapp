<template lang="pug">

//-
  COMPONENT TREE
  Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

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
  TheHeading
    | {{now.w}} {{now.d}} {{now.m}}&mdash;{{now.H}}
    span.anim--blink :
    | {{now.M}}
  ArrayButtonFlat
    ButtonFlat(icon='edit') Devoir
    ButtonFlat(icon='note_add') Nouveau chapitre
    ButtonFlat(icon='format_list_bulleted') Contrôle
    ButtonFlat(icon='insert_drive_file') Dernier chapitre
  MainGroup
    MainGroupLeft
      HeadingSub cours suivant
      template(v-if='upcomingCourse')
        CardCourseUpcoming(v-bind='upcomingCourse')
          template(v-if='upcomingCourse.homework')
            HeadingSub devoirs du cours suivant
            CardHomework(v-bind='homework', v-for='(homework, i) in upcomingCourse.homework', :key='i')
          CardEmpty(v-else='') 👌
      CardEmpty(v-else='') C'est bientôt fini 😉
    MainGroupRight
      HeadingSub moyenne
      // <BigNumber v-bind="globalMean" />
      HeadingSub Évolution
      // <BigNumber v-bind="evolution"/>
</template>

<script>
import axios from "axios";
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

export default {
  middleware: 'authed',
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
    CardEmpty
  },

  data() {
    let now = new Date(Date.now());
    let days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    let months = [
      "Janv",
      "Fév",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Sept",
      "Nov",
      "Déc"
    ];
    return {
      addExerciseModal: false,
      now: {
        H: String(now.getHours()).padStart(2, "0"),
        M: String(now.getMinutes()).padStart(2, "0"),
        w: days[now.getDay()],
        m: months[now.getMonth()],
        d: now.getDate()
      },
    }
  },

  computed: {
    ...mapGetters({
      token: 'auth/token',
      upcomingCourse: 'schedule/upcomingCourse',
      currentCourse: 'schedule/currentCourse'
    })
  },

  async mounted() {
    const {data} = await axios.get("http://127.0.0.1:8000/api/events/", {
        headers: { Authorization: "Bearer " + this.token }
    })
    this.$store.dispatch('setCourses', data)
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.TheHeading span.anim--blink
  position: relative
  top: -.1em
</style>
