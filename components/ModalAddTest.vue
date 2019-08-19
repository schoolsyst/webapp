<template lang="pug">
.multimodal
    PickerSubject(parent-modal="add-test" @pick="pickSubject")
    BaseModal(name="add-test")
        .row.top
            BadgeSubject(
                v-bind="mutSubject"
                open-modal="add-test-subject-picker"
                open-at="self" 
            )
            //TODO: use dropdown w/ search to select a note title of that subject
            .field
              span.before-input le
              InputFlat(:value="nextCourseDate", name="date", placeholder="JJ/MM/AAAA")
            .field
              span.before-input en
              InputFlat(:value="nextCourseRoom", name="room", placeholder="Salle")
            .field
              span.before-input sur
              InputFlat(:value="defaultMax", name="grade-max")
            .field
              span.before-input coef
              InputFlat(:value="defaultWeight", name="grade-weight")
        .row.main
            .to-learn
              HeadingSub À apprendre
              TextBlockInput(name="to-learn")
              //TODO: list of dropdowns w/ each note of subject as option || list of <input>'s
            .additional-notes
              HeadingSub Notes additionnelles
              TextBlockInput(name="notes")
        ArrayButtonReg.row.buttons
            ButtonRegSecondary(close-modal) Annuler
            ButtonRegPrimary(@click="$event('confirm')", close-modal) Ajouter
</template>

<script>
import moment from "moment";
import BaseModal from "~/components/BaseModal.vue";
import HeadingSub from "~/components/HeadingSub.vue";
import BadgeSubject from "~/components/BadgeSubject.vue";
import InputFlat from "~/components/InputFlat.vue";
import TextBlockInput from "~/components/TextBlockInput.vue";
import ArrayButtonReg from "~/components/ArrayButtonReg.vue";
import ButtonRegPrimary from "~/components/ButtonRegPrimary.vue";
import ButtonRegSecondary from "~/components/ButtonRegSecondary.vue";
import PickerSubject from "~/components/PickerSubject.vue";
import { mapGetters } from "vuex";

export default {
  name: "ModalAddExercise",
  components: {
    BaseModal,
    BadgeSubject,
    InputFlat,
    TextBlockInput,
    ArrayButtonReg,
    ButtonRegPrimary,
    ButtonRegSecondary,
    PickerSubject,
    HeadingSub
  },
  props: {
    subject: {
      type: Object,
      default: () => {
        return {
          color: "black",
          abbreviation: "...",
          _isPlaceholder: true
        };
      }
    }
  },
  data() {
    return {
      newNoteName: "",
      mutSubject: this.subject
    };
  },
  computed: {
    ...mapGetters({
      nextCourseOf: "schedule/nextCourseOf",
      setting: "schedule/setting"
    }),
    nextCourse() {
      if ("_isPlaceholder" in this.mutSubject) return "";
      let nextCourse = this.nextCourseOf(this.mutSubject.slug);
      if (nextCourse) return nextCourse;
      return "";
    },
    nextCourseDate() {
      if (this.nextCourse) {
        let val = this.nextCourse.date;
        return val;
      }
      return "";
    },
    nextCourseRoom() {
      if (this.nextCourse) {
        let val = this.nextCourse.room;
        return val;
      }
      return "";
    },
    defaultMax() {
      return this.setting("default_max") || "";
    },
    defaultWeight() {
      return this.setting("default_weight") || "";
    }
  },
  methods: {
    pickSubject($event) {
      this.mutSubject = $event;
      document
        .getElementById("modal_add-test-subject-picker")
        .classList.remove("opened");
    }
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.field
    display: flex
    align-items: center
.row:not(.top)
    margin-bottom: 30px
.row.top
  display: flex
  align-items: center
  +phone
    display: flex
    flex-direction: column
    .field, .BadgeSubject
      width: 100%
      justify-content: flex-start
    .BadgeSubject
      margin-right: 10px
      margin-bottom: 10px
    
.row.main
  margin-top: 20px
  +tablet
    display: grid
    grid-template-columns: 1fr 1fr
    grid-gap: 20px
  +phone
    display: flex
    flex-direction: column
    align-items: flex-start
    .to-learn
      width: 100%
.row.buttons
  justify-content: flex-end
  padding: 0 20px
  padding-right: 0
  margin-bottom: 0
  margin-top: 0
  .BaseButtonReg
    margin-right: 15px
  .BaseButtonReg:last-child
    margin-right: 0
  +phone
    padding: 0
    flex-direction: column
    justify-content: center
    .BaseButtonReg
      width: calc(100% - 10px)
      text-align: center
      margin-bottom: 10px

.ModalAddTest
  +phone
    overflow-y: scroll

.BadgeSubject
  margin-right: 20px
.InputFlat /deep/ input
  font-weight: bold
  font-family: 'Roboto Mono', monospace
.InputFlat /deep/ label
  display: none
.InputFlat
    font-size: 24px
    +desktop
      font-size: 28px
    &.input_date, &.input_date input
      width: 190px
    &.input_room, &.input_room input
      width: 110px
    &.input_grade-max, &.input_grade-max input
      width: 75px
    &.input_grade-weight, &.input_grade-weight input
      width: 50px

.before-input
  font-size: 36px
  +tablet
    &:first-child
      margin-left: 20px

.row span
  font-size: 18px
  //FIXME: not working
  & ~ .FlatInput /deep/ input
    &, &::placeholder
      font-size: 24px
      font-weight: bold

.HeadingSub
    margin-top: 0
    font-size: 20px
textarea
    display: block
    width: 100%
    margin-right: 0
.BadgeSubject
    &:hover
      cursor: pointer
    &:focus
      outline: none
.TextBlockInput
  margin-top: 5px
  +phone
    width: 100%
    margin-bottom: 20px

</style>