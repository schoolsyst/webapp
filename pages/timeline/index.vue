<template lang="pug">
.container
	//- @ Main Timeline
	.timeline(v-if="nextCourses.length || currentCourse")
		//- Timeline's dotted line
		.line.-invert-on-dark-theme
		ul.events
			//- Current event
			li.current
				span.time {{ formatTime()(now, 'HH:mm') }}
				CardCourse(
					v-if="currentCourse" 
					v-bind="currentCourse"
					:expanded="expandedCourse === currentCourse.uuid"
					@expand="expandedCourse = currentCourse.uuid"
					@close="expandedCourse = null"
				)
				CardCourse(v-else empty) Pas de cours en ce moment
							
			li.title(v-if="nextCourses.length")
				span.time.empty
				HeadingSub
					| dans {{ formatDistance(nextCourses[0].start) }}
			//- For each course that are upcoming
			li(v-for="(course, i) in nextCourses" :key="course.uuid")
				span.time
					| {{ formatTime()(course.start, 'HH:mm') }}
					//- Don't show redundant info: hide end time when courses immediately follow
					template(v-if="formatTime()(nextCourse(i).start) !== formatTime()(course.end)")
						Icon chevron_right
						| {{ formatTime()(course.end, 'HH:mm') }}
				CardCourse(
					v-bind="course"
					:expanded="expandedCourse === course.uuid"
					@expanded="expandedCourse = course.uuid"
					@closed="expandedCourse = null"
				)
			//- Time until end of courses
			li.title
				span.time.empty
				HeadingSub fin dans {{ formatDistance(endOfDay()) }}
	ScreenEmpty(v-else @cta="$router.push('/homework')")
		template(#smiley) ^^
		p {{todayCourses.length ? 'Plus' : 'Pas'}} de cours pour aujourd'hui
		template(#cta) Voir les devoirs
</template>

<script>
import { formatDistanceStrict } from 'date-fns'
import { fr } from 'date-fns/locale'
import { firstBy } from 'thenby'
import { mapState, mapGetters } from 'vuex'
import HeadingSub from '~/components/legacy/HeadingSub.vue'
import Icon from '~/components/legacy/Icon.vue'
import CardCourse from '~/components/legacy/CardCourse.vue'
import ScreenEmpty from '~/components/legacy/ScreenEmpty.vue'

export default {
  components: { HeadingSub, Icon, CardCourse, ScreenEmpty },
  head: {
    title: 'Timeline',
  },
  data() {
    return {
      expandedCourse: null,
    }
  },
  computed: {
    ...mapState(['now']),
    ...mapGetters('schedule', [
      'todayCourses',
      'currentCourse',
      'nextCoursesIn',
      'endOfDay',
    ]),
    ...mapGetters(['textColor']),
    nextCourses() {
      return this.nextCoursesIn(this.now).sort(firstBy('start'))
    },
  },
  mounted() {
    this.$withLoadingScreen(
      async () => {
        await this.$store.dispatch('schedule/load')
      },
      { title: '' }
    )
    this.loaded = true
  },
  methods: {
    ...mapGetters(['formatTime']),
    nextCourse(i) {
      let ret
      // If that condition is true, we're already on the last course.
      if (i === this.nextCourses.length - 1) ret = { start: null }
      else ret = this.nextCourses[i + 1]
      return ret
    },
    formatDistance(date) {
      return formatDistanceStrict(date, this.now, { locale: fr })
    },
  },
  watch: {
    expandedCourse() {
      console.log(this.expandedCourse)
    },
  },
}
</script>

<style lang="stylus" scoped>
//=====================
//LOADING
//=====================
.loading
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  z-index 100
  display flex
  justify-content center
  align-items center
  width 100vw
  height 100vh
  background var(--white)
  text-align center

//=====================
//LINE
//=====================
.timeline .line
  position relative
  left 2.25em * 7.75
  z-index -10

  @media (max-width: 888px)
    left 30px

  //background-size 2em 40em
  width 1em
  background url('/misc/timeline-line.svg')
  background-repeat repeat-y
  opacity 0.25

//=====================
//TITLES
//=====================
li.title > :not(.time)
  position relative
  z-index 10
  padding 0.2em 0
  background var(--white)

  @media (min-width: calc(888px + 1px))
    margin-left var(--border-radius)

  @media (max-width: 888px)
    width 100%

//=====================
//TIME STAMPS
//=====================
li .time
  display flex
  justify-content flex-end
  align-items center
  width 180px
  font-size 1.5em
  font-family var(--fonts-monospace)

  i //<-- Caret icon between two time stamps
    padding 0 0.25em

  //Mobile
  @media (min-width: calc(888px + 1px))
    margin-right 1.5rem

  @media (max-width: 888px)
    justify-content flex-start
    margin-bottom 0.5em
    padding 0.5em 0
    width 100%

    &:not(.empty)
      position relative
      z-index 10
      background var(--white)

li.current .time
  font-size 2.25em

//=====================
//ITEM LAYOUT
//=====================
ul
  margin-left 1em
  list-style none

  @media (max-width: 888px)
    margin-left -1em //FIXME
    width 100%

li
  margin-bottom 2em

  &.title, &.current
    margin-bottom 1em

  display flex
  align-items center

  @media (max-width: 888px)
    flex-direction column

//=====================
//SPECIAL CASES
//=====================
.no-courses
  display flex
  flex-direction column
  align-items center
  margin-top 3em
  width 100%
  text-align center
  font-size 1.5em

  p
    margin-top 1em

//=====================
//GLOBAL LAYOUT
//=====================
.timeline
  display flex

  @media (max-width: 600px)
    margin-right 20px
    margin-left 20px
</style>
