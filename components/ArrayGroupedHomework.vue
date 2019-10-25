<template lang="pug">
  ul.ArrayGroupedHomework
    li(v-for="group in groups" :key="group.due")
      template(v-if="group.shown")
        HeadingSub(v-if="showHeaders") {{ group.dispDue }}
        ArrayItemExercise(:exercises="only('exercices', group.homeworks)")
        ArrayCardTest(:tests="only('tests', group.homeworks)")
      
</template>

<script>
import ArrayItemExercise from '~/components/ArrayItemExercise.vue'
import ArrayCardTest from '~/components/ArrayCardTest.vue'
import { mapGetters } from 'vuex'

export default {
  name: "ArrayGroupedHomework",
  components: { ArrayItemExercise, ArrayCardTest },
  props: {
    homeworks: {
      type: Array,
      default: []
    },
    showHeaders: {
      type: Boolean,
      default: true
    }
  },
  methods: mapGetters({
    only: 'homework/only'
  })
}
</script>
