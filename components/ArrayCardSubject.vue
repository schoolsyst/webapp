<template lang="pug">
ul.ArrayCardSubject
	slot
	li(v-for="(subject, i) in orderBy('hue', subjects)" :key="subject.uuid")
		CardSubject(v-bind="subject" :expanded="subject.uuid === expandedItem" @expand="$event ? expandedItem = subject.uuid : expandedItem = ''")
</template>

<script>
import CardSubject from '~/components/CardSubject.vue'
import { mapGetters } from 'vuex'

export default {
	name: 'ArrayCardSubject',
	components: { CardSubject },
	props: {
		subjects: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		return {
			expandedItem: "",
			_subjects: this.orderBy('hue', this.subjects)
		}
	},
	methods: mapGetters('subjects', ['orderBy']),
}
</script>

<style lang="stylus" scoped>
li
	margin-top: 15px
	max-width 100%
</style>
