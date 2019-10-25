<template>
	<BaseCard class="CardHomework" :style="{backgroundColor: subject.color}">
		<h4 class="name">{{name}}</h4>
		<div class="progress-bar">
			<div class="completed" :style="{width: percentProgress}"></div>
			<span class="percent">{{progress == 1 ? 'TERMINÉ' : percentProgress}}</span>
		</div>
	</BaseCard>
</template>

<script>
import BaseCard from "~/components/BaseCard.vue"

export default {
	name: 'CardHomework',

	components: {
		BaseCard
	},

	props: {
		progress: {
			// float in [0;1]
			validator: function(value) { return value <= 1 && value >= 0},
			default: 1
		},
		subject: {
			type: Object,
			required: true
		},
		name: {
			type: String,
			required: true,
		}
	},


	data() {
		return {

		}
	},

	computed: {
		percentProgress() {
			return this.progress * 100 + '%'
		}
	},


	created() {

	},


	methods: {

	}
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.CardHomework 
	border-radius: 10px
	height: auto
	max-width: 500px
	padding: 0

.name, .percent 
	padding: 0 20px
	color: white

.name 
	padding: 10px 20px
	line-height: 56px
	font-size: 48px
	font-weight: normal

.percent 
	font-size: 24px
	padding: 20px

.progress-bar 
	position: relative
	display: flex
	align-items: center

.progress-bar .completed 
	position: absolute
	background: rgba(255,255,255,0.5)
	width: 100%

.progress-bar, .progress-bar .completed 
	height: 40px

</style>
