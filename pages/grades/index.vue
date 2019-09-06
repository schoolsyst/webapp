<template lang="pug">
  div.container
    TheHeading Notes
    ArrayButtonFlat 
    MainGroup.full-size
      MainGroupLeft
        HeadingSub Contrôles prévus
        ul.due-tests
          li(v-for="test in dueTests", :key="test.uuid") 
            ItemGrade(v-bind="test", :editable-fields="['goal', 'maximum', 'weight']" :disabled-fields="['actual']")
        HeadingSub Contrôles rendus
        ul.due-tests
          li(v-for="test in pastTests", :key="test.uuid") 
            ItemGrade(v-bind="test", :editable-fields="['goal', 'maximum', 'weight', 'expected', 'actual']")

      MainGroupRight
        HeadingAlt Statistiques
        p À venir!

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import TheHeading from "~/components/TheHeading.vue";
import ArrayButtonFlat from "~/components/ArrayButtonFlat.vue";
import ButtonFlat from "~/components/ButtonFlat.vue";
import MainGroup from "~/components/MainGroup.vue";
import MainGroupLeft from "~/components/MainGroupLeft.vue";
import MainGroupRight from "~/components/MainGroupRight.vue";
import HeadingSub from "~/components/HeadingSub.vue";
import HeadingAlt from '~/components/HeadingAlt.vue'
import ItemGrade from '~/components/ItemGrade.vue'
import moment from 'moment';

export default {
  components: {
    TheHeading,
    ArrayButtonFlat,
    ButtonFlat,
    MainGroup,
    MainGroupLeft,
    MainGroupRight,
    HeadingSub,
    HeadingAlt,
    ItemGrade,
  },

  computed: {
    ...mapGetters({
      dueTests: "homework/dueTests",
      pastTests: "homework/pastTests"
    }),
  },

};
</script>

<style lang="stylus" scoped>
.HeadingSub
  margin-top 10px

.due-tests
  margin-top: 20px
  display grid
  grid-template-columns 1fr 1fr
  grid-gap 30px
</style>