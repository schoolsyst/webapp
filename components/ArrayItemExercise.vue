<template lang="pug">
ul.ArrayItemExercise
  li(v-for="exercise in exercises" :key="exercise.uuid")
    ItemExercise(
      v-bind="exercise"
      @expand="$event ? expandedItem = exercise.uuid : expandedItem = null"
      :expanded="expandedItem === exercise.uuid"
    )
</template>

<script>
import ItemExercise from "~/components/ItemExercise.vue";

export default {
  name: "ArrayItemExercise",

  components: { ItemExercise },

  props: {
    exercises: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      expandedItem: {
        uuid: null
      }
    };
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.ArrayItemExercise
  //--- positioning ---
  margin-top: 30px
  //--- dimensions  ---

  //---   margins   ---
  li:not(:last-child)
    margin-bottom: 10px
  //---  appearance ---
  
  //---  animation  ---
</style>
