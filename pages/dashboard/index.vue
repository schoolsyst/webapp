<template>

<!-- COMPONENT TREE
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
-->


  <div class="container">
    <TheHeading>{{now.w}} {{now.d}} {{now.m}}—{{now.H}}<span class="anim--blink">:</span>{{now.M}}</TheHeading>
    <ArrayButtonFlat>
      <ButtonFlat icon="edit">Devoir</ButtonFlat>
      <ButtonFlat icon="format_list_bulleted">Contrôle</ButtonFlat>
      <ButtonFlat icon="note_add">Nouveau chapitre</ButtonFlat>
      <ButtonFlat icon="insert_drive_file">Dernier chapitre</ButtonFlat>
    </ArrayButtonFlat>
    <MainGroup>
      <MainGroupLeft>

        <HeadingSub>cours suivant</HeadingSub>
        <template v-if="upcomingCourse">
          <CardCourseUpcoming v-bind="upcomingCourse"/>
          <template v-if="upcomingCourse.homework">
            <HeadingSub>devoirs du cours suivant</HeadingSub>
            <CardHomework v-bind="homework" v-for="(homework, i) in upcomingCourse.homework" :key="i" />
          </template>
          <CardEmpty v-else>trql ta r</CardEmpty>
        </template>
        <CardEmpty v-else>C'est bientôt fini 😉</CardEmpty>
      </MainGroupLeft>
      <MainGroupRight>
        <HeadingSub>moyenne</HeadingSub>
        <!-- <BigNumber v-bind="globalMean" /> -->
        <HeadingSub>Évolution</HeadingSub>
        <!-- <BigNumber v-bind="evolution"/> -->
      </MainGroupRight>
    </MainGroup>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TheHeading from '~/components/TheHeading.vue'
import ArrayButtonFlat from '~/components/ArrayButtonFlat.vue'
import ButtonFlat from '~/components/ButtonFlat.vue'
import MainGroup from '~/components/MainGroup.vue'
import MainGroupLeft from '~/components/MainGroupLeft.vue'
import MainGroupRight from '~/components/MainGroupRight.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import BigNumber from '~/components/BigNumber.vue'
import CardCourseUpcoming from '~/components/CardCourseUpcoming.vue'
import CardHomework from '~/components/CardHomework.vue'
import CardEmpty from '~/components/CardEmpty.vue'

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
      CardEmpty
  },
  

  data() {
    let now = new Date(Date.now())
    let days = [
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi'
    ]
    let months = [
      'Janv',
      'Fév',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Sept',
      'Nov',
      'Déc',
    ]
    return {
      addExerciseModal: false,
      now: {
        H: String(now.getHours()).padStart(2, '0'),
        M: String(now.getMinutes()).padStart(2, '0'),
        w: days[now.getDay()],
        m: months[now.getMonth()],
        d: now.getDate()
      }
    }
  },

  computed: {
    isLoggedIn() { return this.$store.state.auth.isLoggedIn },
    upcomingCourse() {
      return this.$store.getters.upcomingCourse
    },
    currentCourse() {
      return this.$store.getters.currentCourse
    }
  },

  mounted() {
  // Get the token
  this.$store.dispatch('auth/init')
  this.$store.dispatch('auth/inspectToken')
  if (!this.isLoggedIn) {
    // get the token if we aren't logged in 
    let password = 'potdefleur7623'
    let username = 'ewen'
    this.$store.dispatch('auth/obtainToken', {password, username})
  }


  axios.get('http://127.0.0.1:8000/api/events/', { headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
    .then((res) => {
      this.$store.commit('schedule/setCourses', res.data)
    })
  },

}
</script>

<style lang="sass" scoped>
.TheHeading span.anim--blink
  position: relative
  top: -.1em
</style>
