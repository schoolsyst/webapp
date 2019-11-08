<template lang="pug">
	BaseCard(class="CardCourseUpcoming" :style="{backgroundColor: currentCourse.subject.color, color: textColor(currentCourse.subject.color)}")
		h4.name {{currentCourse.subject.name}}
		div.room {{currentCourse.room}}
		time.remaining-time {{ timeRemaining.capFirstChar() }}
</template>

<script>
import tinycolor from 'tinycolor2'
import moment from "moment";
import BaseCard from "~/components/BaseCard.vue";
import { formatDistanceToNow } from 'date-fns'
import { mapGetters } from 'vuex';
import { fr } from 'date-fns/locale';

export default {
	name: "CardCourseUpcoming",

	components: {
		BaseCard
	},

	props: {
		course: {
			type: Object,
			default: null
		}
	},

	data() {
		return {};
	},

	computed: {
		...mapGetters('schedule', {getCurrentCourse: 'currentCourse'}),
		timeRemaining() {
			return formatDistanceToNow(this.currentCourse.start, { locale: fr })
		},
		currentCourse() {
			return this.course || this.getCurrentCourse
		}
	},

	methods: {
		...mapGetters(['textColor'])
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
.CardCourseUpcoming 
	height: 250px
	display: grid
	grid-template-columns: repeat(2, 1fr)
	grid-template-rows: 1fr
	max-width: 500px
	padding: 10px

.name 
	// color: white
	font-size: 56px
	line-height: 56px
	+phone
		line-height: 48px
		font-size: 48px
	grid-column: 1/ span 2
	grid-row: 1
	height: 175px


.room, .remaining-time 
	// color: white
	font-size: 24px
	grid-row: 2

.room 
	grid-column: 1

.remaining-time 
	grid-column: 2
	text-align: right

</style>
