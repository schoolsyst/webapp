<template lang="pug">
//TODO: create a <CardEvent> component for .card-wrapper & children
.container
	.timeline(v-if="nextCourses().length || currentCourse")
		.line
		ul.events
			li.current
				span.time {{ formatTime(now, 'HH:mm') }}
				template(v-if="currentCourse")
					.card-wrapper
						.card(:style="{backgroundColor: currentCourse.subject.color, color: textColor(currentCourse.subject.color)}")
							span.subject {{ currentCourse.subject.name }}
							span.room {{ currentCourse.room }}
				template(v-else)
					.card.empty Pas de cours en ce moment
			li.title
				span.time.empty
				HeadingSub(v-if="nextCourses().length") prochainement
			li(v-for="(course, i) in nextCourses()" :key="course.uuid")
				span.time
					| {{ formatTime(course.start, 'HH:mm') }}
					template(v-if="formatTime(nextCourse(i).start) !== formatTime(course.end)")
						Icon chevron_right
						| {{ formatTime(course.end, 'HH:mm') }}
				.card-wrapper
					.card(
						:style="{backgroundColor: course.subject.color, color: textColor(course.subject.color)}"
					)
					span.subject {{ course.subject.name }}
					span.room {{ course.room }}
			li.title
				span.time {{ formatDistance(endOfDay()) }}
				HeadingSub fin des cours
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
import { format, isAfter, formatDistanceStrict } from 'date-fns'
import { fr } from 'date-fns/locale'
import { mapState, mapGetters } from 'vuex'

export default {
	components: { HeadingSub, Icon },
	computed: {
		...mapState(['now']),
		...mapGetters('schedule', ['todayCourses', 'currentCourse', 'nextCourses', 'endOfDay']),
		...mapGetters(['textColor'])
	},
	methods: {
		nextCourse(i) {
			let ret
			// If that condition is true, we're already on the last course.
			if (i === this.nextCourses().length - 1)
				ret = { start: null }
			else
				ret = this.nextCourses()[i+1]
			return ret
		},
		formatTime(time) {
			if (time === null) return null
			return format(time, 'HH:mm')
		},
		formatDistance(date) {
			return formatDistanceStrict(date, this.now, { locale: fr })
		}
	},
	async mounted() {
		await this.$store.dispatch('schedule/load')
	}
}
</script>

<style lang="stylus" scoped>
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
//    COURSE CARDS
//=====================
.card
	padding 0 1.5em
	z-index: 10
	height: 65px
	width: 500px
	border-radius var(--border-radius)
	display flex
	align-items center
	&.current
		justify-content center
	&.empty
		background var(--grey)
.card .subject
	font-size: 1.5em
.card .room
	margin-left auto
	font-family var(--fonts-monospace)
@media (max-width 1000px)
	.card-wrapper
		width: 100%
		display flex
		justify-content flex-start
	.card
		width: 100%
		max-width 500px
//=====================
//        TITLES
//=====================
li.title > :not(.time)
	background white
	position relative
	z-index: 10
	padding 0.5em 0
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
		margin-right .75em
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
