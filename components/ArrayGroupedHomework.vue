<template lang="pug">
	ul.ArrayGroupedHomework
		li(v-for="group in groups" :key="group.due")
			template(v-if="group.shown")
				HeadingSub(v-if="showHeaders") {{ group.dispDue }}
				ArrayItemExercise(
					v-if="only !== 'tests'"
					:exercises="only()('exercices', group.homeworks)"
				)
				ArrayCardTest(
					v-if="only !== 'exercises'"
					:tests="only()('tests', group.homeworks)"
				)

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
		},
		only: {
			type: [String, Boolean],
			default: false
		},
		homeworks: {
			type: Array,
			default: () => ([])
		}
	},
	mounted() {
    this.load()
	},
	computed: {
		...mapGetters('homework', [
			'grouped'
		]),
		groups() {
			if(this.homeworks.length) 
				return this.group(this.homeworks)
			else
				return this.grouped
		}
	},
	methods: {
    ...mapGetters('homework', ['only', 'group']),
	  ...mapActions('homework', ['load'])
	}
}
</script>
