<template lang="pug">
BaseCard.CardSubject(:style="{backgroundColor: mutColor, color: textColor}", :class="{editing}")
  p.name 
    input(v-model="mutName" placeholder="Nom de la matière...")
    //-TODO: close button reverts values to those passed in props
    ButtonIcon.edit-button(@click="editing = !editing" :color="textColor") {{ editing ? 'close' : 'edit' }}
  .row
    .field
      LabelFlat Abbreviation*
      input.abbreviation(maxlength="3" :value="abbreviation" @input="mutAbbreviation = $event" placeholder="ABC")
    .field
      LabelFlat Couleur*
      PickerColor.color(v-model="mutColor" :color="textColor" :modal-id="uuid")
    .field
      LabelFlat Objectif
      BigNumber.grade-goal(
        small
        :writables="['value']"
        @input="mutGrade_goal = $event",
        :value="grade_goal * gradeUnit"
        :unit="`/${gradeUnit}`"
      )
  .row
    .field
      LabelFlat Salle par défaut
      input.room(v-model="mutRoom")
    .field
      LabelFlat Poids total
      BigNumber.physical-weight(
        small
        :writables="['value']"
        @input="mutPhysical_weight = $event",
        :value="physical_weight"
        unit="kg"
      )
  .button-row
    ButtonIcon.confirm-button(@click="editing = false; $emit('editing-finished', subject)" :color="textColor") check
</template>

<script>
import BigNumber from "~/components/BigNumber.vue";
import ButtonIcon from "~/components/ButtonIcon.vue";
import LabelFlat from "~/components/LabelFlat.vue";
import PickerColor from "~/components/PickerColor.vue";
import BaseCard from "~/components/BaseCard.vue";
import InputFlat from '~/components/InputFlat.vue'
import { mapGetters } from 'vuex';
import tinycolor from 'tinycolor2'

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

  data() {
    return {
      editing: false,
      mutColor: this.color,
      mutName: this.name,
      mutGrade_goal: this.grade_goal,
      mutRoom: this.room,
      mutPhysical_weight: this.physical_weight,
      mutAbbreviation: this.abbreviation,
    }
  },
  
  computed: {
    ...mapGetters({
      setting: 'setting'
    }),
    gradeUnit() {
      return Number(this.setting('grade_max').value)
    },
    textColor() {
      return tinycolor(this.mutColor).isLight() ? 'black' : 'white'
    },
    subject() {
      return {
        color: this.mutColor,
        name: this.mutName,
        grade_goal: isNaN(this.mutGrade_goal) ? null : (Number(this.mutGrade_goal) / this.gradeUnit),
        room: this.mutRoom,
        physical_weight: this.mutPhysical_weight,
        abbreviation: this.mutAbbreviation,
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.CardSubject
  width 600px
  padding 20px
  height: 275px
  overflow hidden
  &:not(.editing)
    height 75px
  transition height 0.25s ease

// Fix some colors
.BigNumber /deep/ *, input
  color inherit

.BigNumber
    margin-top: -5px
    line-height 36px
    & /deep/ .value
        height 36px
        font-size 36px
    & /deep/ .unit
        font-size calc(2/3 * 36px)
        line-height calc(2/3 * 36px)
        opacity: 1

input
  font-size 36px
  padding-bottom: 5px //Correct 'g'/'q's being cut off

.LabelFlat
  text-transform none
  opacity 1
  font-weight normal
  font-size: 22px

.row
  display grid
  grid-template-columns repeat(3, 200px)
  grid-gap 10px
  margin-top: 25px

.button-row
  position relative

.confirm-button
  position absolute
  right 0
  top -40px
  & /deep/ .icon
    font-size: 48px

.edit-button /deep/ .icon
  font-size: 36px

.name
  font-size: 32px
  margin-bottom: 20px
  font-weight bold
  display grid
  align-items center
  grid-template-columns calc(100% - 36px) 36px

.abbreviation
  text-transform uppercase
  font-family 'Roboto Mono', monospace
  letter-spacing 2px
</style>