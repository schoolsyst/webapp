<template lang="pug">
	.page-container
		TheHeading
			| {{format($store.state.now, 'dddd D MMM')}}
			| &mdash; {{format($store.state.now, 'HH')}}
			span.time-separator :
			| {{format($store.state.now, 'mm')}}
		ArrayButtonFlat
			li: ButtonFlat.add-homework(
				icon="edit"
				open-modal="add-homework"
				open-at="center"
			) Devoir
			li: ButtonFlat.add-note(
				icon="note_add"
				open-modal="add-note"
				open-at="center"
			) Note
			li: ButtonFlat.open-latest-note(
				icon="insert_drive_file"
				@click="openCurrentSubjectLatestNote"
				:disabled="!currentCourse"
			) Dernière note
			li: ButtonFlat.add-mutation(
				icon="schedule"
				open-modal="add-mutation"
				open-at="center"
			) Modification d'emploi du temps
		MainGroup
			MainGroupLeft
				template(v-if="currentCourse || upcomingCourse")
					HeadingSub Cours suivant
					template(v-if="upcomingCourse")
						CardCourseUpcoming
						HeadingSub Devoirs du cours suivant
						ArrayHomework(:homeworks="homeworkFor(upcomingCourse)" v-if="homeworkFor(upcomingCourse).length")
						CardEmpty(v-else) 👌
					template(v-else)
						CardEmpty 
							| Fin de la journée 
							| {{ formatDistance(currentCourse.end, $store.state.now, { addSuffix: true, locale: fr }) }} !
				template(v-else)
					HeadingSub
						| Devoirs à venir
						ArrayButtonFlat
							li: ButtonFlat(icon="arrow_forward"): nuxt-link(to="/homework") Voir tout
					ArrayItemExercise(
						:exercises="currentOrNextWeekHomework"
					)
			MainGroupRight
				HeadingSub moyenne
				BigNumber(:value="currentTrimesterMean * settingValue('grade_max')" :unit="`/${settingValue('grade_max')}`" :fixed="2")
				HeadingSub Évolution
				p La moyenne était de {{display(meanBeforeLastGrade)}}/{{settingValue('grade_max')}} avant la dernière note
				BigNumber(:value="currentTrimesterEvolution * 100" show-sign :fixed="2", unit="%")
</template>

<script>
import { format, formatDistance, isBefore } from 'date-fns'
import { fr } from 'date-fns/locale'
import { mapGetters, mapActions } from 'vuex'
import {firstBy, thenBy} from "thenby"
//-----------------------------------------------
import TheHeading from '~/components/TheHeading.vue'
import ArrayButtonFlat from '~/components/ArrayButtonFlat.vue'
import ButtonFlat from '~/components/ButtonFlat.vue'
import MainGroup from '~/components/MainGroup.vue'
import MainGroupLeft from '~/components/MainGroupLeft.vue'
import MainGroupRight from '~/components/MainGroupRight.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import BigNumber from '~/components/BigNumber.vue'
import CardCourseUpcoming from '~/components/CardCourseUpcoming.vue'
import CardEmpty from '~/components/CardEmpty.vue'
import ArrayItemExercise from '~/components/ArrayItemExercise.vue'
import ModalAddHomework from '~/components/ModalAddHomework.vue'
import ModalAddNote from '~/components/ModalAddNote.vue'

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
		CardEmpty,
		ArrayItemExercise,
		ModalAddHomework,
		ModalAddNote,
	},
	computed: {
		...mapGetters('schedule', ['currentCourse', 'upcomingCourse']),
		...mapGetters('grades', [
			'currentTrimesterEvolution',
			'currentTrimesterMean',
			'mean',
			'display'
		]),
		...mapGetters({
			currentOrNextWeekHomework: 'homework/currentOrNextWeek',
			settingValue: 'settings/value',
			grades: "grades/currentTrimester",
		}),
		meanBeforeLastGrade() {
			this.mean(this.grades.filter((o) => !!o.obtained).slice(0, -1))
		},
	},
	methods: {
		format,
		formatDistance,
		...mapGetters({
			homeworkFor: 'homework/for'
		}),
		openCurrentSubjectLatestNote() {
			if (!this.currentCourse) {
				return
			}

			let notesByModDate = this.notesOf(this.currentCourse.subject).sort(
				firstBy((a, b) => isBefore(a.modified, b.modified))
			)
			if (notesByModDate.length) {
				this.$router.push(`/notes/${notesByModDate[0].uuid}`)
			} else {
				this.$toast.error(
					`Aucune prise de note de ${this.currentCourse.subject.name} trouvée`
				)
			}
		}
	},

}
</script>
