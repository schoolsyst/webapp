<template lang="pug">
	ul.ArrayGroupedHomework
		li(v-for="group in grouped" :key="group.due")
			template(v-if="group.shown")
				HeadingSub(v-if="showHeaders") {{ group.dispDue }}
				ArrayItemExercise(:exercises="only()('exercices', group.homeworks)")
				ArrayCardTest(:tests="only()('tests', group.homeworks)")

</template>

<script>
import ArrayItemExercise from '~/components/ArrayItemExercise.vue'
import ArrayCardTest from '~/components/ArrayCardTest.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
	name: "ArrayGroupedHomework",
	components: { ArrayItemExercise, ArrayCardTest, HeadingSub },
	props: {
		showHeaders: {
			type: Boolean,
			default: true
		}
	},
	mounted() {
    this.load()
	},
	computed: mapGetters('homework', [
		'grouped'
	]),
	methods: {
    ...mapGetters('homework', ['only']),
	  ...mapActions('homework', ['load'])
	}
}
</script>
