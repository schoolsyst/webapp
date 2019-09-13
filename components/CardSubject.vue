<template lang="pug">
BaseCard.CardSubject(:style="{backgroundColor: color, color: 'white'}")
  p.name {{name}}
  .row
    InputFlat.abbreviation(maxlength="3" :value="abbreviation")
    PickerColor.color(:value="color")
    BigNumber.grade-goal(small :value="grade_goal * gradeUnit", :unit="`/${gradeUnit}`")
  .row
    InputFlat.room(:value="room")
    BigNumber.physical-weight(small :value="physical_weight", unit="kg")
</template>

<script>
import BigNumber from "~/components/BigNumber.vue";
import ButtonIcon from "~/components/ButtonIcon.vue";
import LabelFlat from "~/components/LabelFlat.vue";
import PickerColor from "~/components/PickerColor.vue";
import BaseCard from "~/components/BaseCard.vue";
import InputFlat from '~/components/InputFlat.vue'
import { mapGetters } from 'vuex';

export default {
  name: "CardSubject",

  components: {
    BigNumber,
    ButtonIcon,
    LabelFlat,
    InputFlat,
    PickerColor,
    BaseCard
  },

  props: {
    color: String,
    name: String,
    uuid: String,
    grade_goal: Number,
    room: String,
    physical_weight: Number,
    abbreviation: String
  },
  
  computed: {
    ...mapGetters({
      setting: 'setting'
    }),
    gradeUnit() {
      return Number(this.setting('grade_max'))
    }
  }
};
</script>

<style lang="stylus" scoped>
.CardSubject
  height 200px
  width 500px

.BigNumber
    margin-top: -5px
    & /deep/ .value
        font-size 64px
    & /deep/ .unit
        font-size 48px
    & /deep/ *
        color white

.row
  display: flex
  align-items: center
</style>