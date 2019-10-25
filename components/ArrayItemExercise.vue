<template lang="pug">
ul.ArrayItemExercise
    slot
</template>

<script>
export default {
  name: "ArrayItemExercise",
}
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