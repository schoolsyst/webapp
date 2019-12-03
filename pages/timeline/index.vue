<template lang="pug">
//-TODO: Real loading
.container
	.loading(v-if="!loaded") Chargement...
	//- @ Main Timeline
	.timeline(v-if="nextCourses().length || currentCourse")
		//- Timeline's dotted line
		.line
		ul.events
			//- Current event
			li.current
				span.time {{ formatTime()(now, 'HH:mm') }}
				CardCourse(
					v-if="currentCourse" 
					v-bind="currentCourse"
					:expanded="expandedCourse === currentCourse.uuid"
					@expanded="expandedCourse = currentCourse.uuid"
					@closed="expandedCourse = null"
				)
				CardCourse(v-else empty) Pas de cours en ce moment
			li.title
				span.time.empty
				HeadingSub(v-if="nextCourses().length")
					| dans {{ formatDistance(nextCourses()[0].start) }}
			//- For each course that are upcoming
			li(v-for="(course, i) in nextCourses()" :key="course.uuid")
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
	.no-courses(v-else)
		h1 
			template(v-if="todayCourses.length") Plus de cours pour aujourd'hui
			template(v-else) Pas de cours pour aujourd'hui
		//FIXME: #[br]#[br] is no good, use margins instead
		p.
			Profitez-en pour #[nuxt-link(to="/homework") faire vos devoirs] 😉
			#[br]#[br]
			C'est une erreur? #[nuxt-link(to="/bug-report") faites-moi en part]
</template>

<script>
import HeadingSub from '~/components/HeadingSub.vue'
import Icon from '~/components/Icon.vue'
import CardCourse from '~/components/CardCourse.vue'
import { format, isAfter, formatDistanceStrict } from 'date-fns'
import { fr } from 'date-fns/locale'
import { mapState, mapGetters } from 'vuex'

export default {
	components: { HeadingSub, Icon, CardCourse },
	data() {
		return {
			expandedCourse: null,
			loaded: false
		}
	},
	computed: {
		...mapState(['now']),
		...mapGetters('schedule', ['todayCourses', 'currentCourse', 'nextCourses', 'endOfDay']),
		...mapGetters(['textColor'])
	},
	methods: {
		...mapGetters(['formatTime']),
		nextCourse(i) {
			let ret
			// If that condition is true, we're already on the last course.
			if (i === this.nextCourses().length - 1)
				ret = { start: null }
			else
				ret = this.nextCourses()[i+1]
			return ret
		},
		formatDistance(date) {
			return formatDistanceStrict(date, this.now, { locale: fr })
		}
	},
	async mounted() {
		await this.$store.dispatch('schedule/load')
		this.loaded = true
	},
	watch: {
		expandedCourse() {
			console.log(this.expandedCourse)
		}
	}
}
</script>

<style lang="stylus" scoped>
//=====================
//       LOADING
//=====================
.loading
	position fixed
	top: 0
	right: 0
	bottom: 0
	left: 0
	width 100vw
	height 100vh
	background white
	display flex
	text-align: center
	justify-content center
	align-items center
	z-index: 100
//=====================
//        LINE
//=====================
.timeline .line 
		position relative
		left: 2.25em * 7.75
		z-index: -10
		@media (max-width 1000px)
			left 30px
		opacity: 0.25
		background url('/misc/timeline-line.svg')
		background-repeat repeat-y
		// background-size 2em 40em
		width 1em
//=====================
//        TITLES
//=====================
li.title > :not(.time)
	background white
	position relative
	z-index: 10
	padding 0.2em 0
	@media (min-width 1001px)
		margin-left: var(--border-radius)
	@media (max-width 1000px)
		width: 100%
//=====================
//     TIME STAMPS
//=====================
li .time
	font-family var(--fonts-monospace)
	font-size: 1.5em
	width 180px
	display flex
	justify-content flex-end
	align-items center
	i //<-- Caret icon between two time stamps
		padding 0 .25em
	// Mobile 
	@media (min-width 1001px)
		margin-right 1.5rem
	@media (max-width 1000px)
		justify-content flex-start
		width: 100%
		margin-bottom 0.5em
		padding 0.5em 0
		&:not(.empty)
			background var(--white)
			position relative
			z-index: 10
li.current .time
	font-size 2.25em
//=====================
//     ITEM LAYOUT
//=====================
ul
	margin-left: 1em
	list-style none
	@media (max-width 1000px)
		margin-left: -1em //FIXME
		width: 100%
li
	margin-bottom 2em
	&.title, &.current
		margin-bottom: 1em
	display flex
	align-items center
	@media (max-width 1000px)
		flex-direction column
//=====================
//    SPECIAL CASES
//=====================
.no-courses
	display flex
	flex-direction column
	align-items center
	text-align: center
	font-size 1.5em
	width 100%
	margin-top 3em
	p
		margin-top 1em
//=====================
//    GLOBAL LAYOUT
//=====================
.timeline
	display flex
</style>
