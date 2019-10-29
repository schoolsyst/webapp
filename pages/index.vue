<template lang="pug">

.container
	ModalAddNote(:subject="currentCourse && currentCourse.subject")
	ModalAddExercise(:subject="currentCourse && currentCourse.subject")
	ModalAddTest(:subject="currentCourse && currentCourse.subject")

	TheHeading
		| {{now.format('dddd D MMM').capFirstChar()}}
		| &mdash; {{now.format('HH')}}
		span.anim--blink :
		| {{now.format('mm')}}
	ArrayButtonFlat
		li: ButtonFlat(
			icon='edit', 
			open-modal="add-exercise", 
			open-at="center"
		) Devoir
		li: ButtonFlat.nomobile(
			icon='note_add', 
			open-modal="add-note", 
			open-at="self"
		) Nouveau chapitre
		li: ButtonFlat(
			icon='format_list_bulleted'
			open-modal="add-test",
			open-at="center"
		) Contrôle
		li: ButtonFlat.nomobile(
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
					//FIXME: Sort by date due
					ArrayButtonFlat(inline)
						li: ButtonFlat(icon="arrow_forward"): nuxt-link.goto-homework(to="/homework") Voir tout
				ArrayItemExercise
					ItemExercise(v-for="exercise in exercises", :key="exercise.uuid" v-bind="exercise")
		MainGroupRight
			HeadingSub moyenne
			BigNumber(:value="currentTrimesterMean" :unit="`/${settingValue('grade_max')}`" :fixed="2")
			HeadingSub Évolution
			p La moyenne était de {{meanBeforeLastGrade || '—'}}/{{settingValue('grade_max')}} avant la dernière note
			BigNumber(:value="currentTrimesterEvolution" show-sign :fixed="2", :unit="`% (${(mean.value - meanBeforeLastGrade > 0) ? '+' : ''}${Math.round(mean.value - meanBeforeLastGrade) || '—'})`")
	</template>

<script>
import axios from "axios"
import moment from "moment"
import tinycolor from "tinycolor2"
import groupBy from "lodash.groupby"
import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
//-------------------------------------------------------
import TheHeading from "~/components/TheHeading.vue"
import ArrayButtonFlat from "~/components/ArrayButtonFlat.vue"
import ButtonFlat from "~/components/ButtonFlat.vue"
import MainGroup from "~/components/MainGroup.vue"
import MainGroupLeft from "~/components/MainGroupLeft.vue"
import MainGroupRight from "~/components/MainGroupRight.vue"
import HeadingSub from "~/components/HeadingSub.vue"
import BigNumber from "~/components/BigNumber.vue"
import CardCourseUpcoming from "~/components/CardCourseUpcoming.vue"
import CardHomework from "~/components/CardHomework.vue"
import CardEmpty from "~/components/CardEmpty.vue"
import ModalAddExercise from "~/components/ModalAddExercise.vue"
import ModalAddNote from "~/components/ModalAddNote.vue"
import ModalAddTest from "~/components/ModalAddTest.vue"
import ArrayItemExercise from "~/components/ArrayItemExercise.vue"
import ItemExercise from "~/components/ItemExercise.vue"

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
		ArrayItemExercise,
		ItemExercise,
	},

	data() {
		moment.locale("fr")
		return {
			addExerciseModal: false,
			now: moment(),
		}
	},

	head() {
		return {
			title: `${this.pageTitleCounter}Schoolsyst`,
		}
	},

	computed: {
		...mapGetters('grades', [
			'currentTrimesterEvolution',
			'currentTrimesterMean',
			'mean',
			'settingValue',
    ]),
    ...mapGetters('homework', [
      'exercises'
    ]),
    ...mapGetters({
      settingValue: 'settings/value',
      grades: 'grades/all',
    }),
    ...mapGetters('schedule', [
      'upcomingCourse',
      'currentCourse',
    ]),
		meanBeforeLastGrade() {
			this.mean(this.grades.slice(0, -1))
		},
		evolutionVerb() {
			if (this.evolution > 0)
				return "gagné"

			if (this.evolution < 0)
				return "perdu"

			return "perdu/gagné"
		},
	},

	methods: {
		openCurrentSubjectLatestNote() {
			if (!this.currentCourse) return

			let notesByModDate = this.notesOf(this.currentCourseSubject.slug).sort(
				(a, b) =>
					moment(a.last_modified, "YYYY-MM-DD[T]hh:mm").isBefore(
						moment(b.last_modified, "YYYY-MM-DD[T]hh:mm")
					)
						? 1
						: -1
			)
			if (notesByModDate.length) {
				this.$router.push(`/notes/${notesByModDate[0].uuid}`)
			} else {
				this.$toast.error(
					`Aucune prise de note de ${this.currentCourseSubject.name} trouvée`
				)
			}
		},
	},

	created() {
		String.prototype.capFirstChar = function() {
			return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase()
		}
		setInterval(() => {
			this.now = moment()
		}, 1000)
	},
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.TheHeading span.anim--blink
	position: relative
	top: -.1em
+mobile
	.nomobile
		display: none !important
.ArrayButtonFlat
	display: grid
	grid-gap: 20px
	+mobile
		grid-template-columns: repeat(4, max-content)
.ArrayItemExercise
	margin-top: 10px
</style>
