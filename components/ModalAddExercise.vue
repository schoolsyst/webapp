<template lang="pug">
.multimodal
    PickerSubject(parent-modal="add-exercise" @pick="pickSubject")
    BaseModal(name="add-exercise")
        .row.top
            BadgeSubject(
                v-bind="mutSubject"
                open-modal="add-exercise-subject-picker"
                open-at="self" 
            )
            InputFlat(
              placeholder="Titre..."
              :value="exerciseName"
              @input="exerciseName = $event"
              name="name"
              modal-autofocus
            )
        .row.context
          .field
            span.before-input le
            InputFlat(
              placeholder="JJ/MM/AAAA"
              :value="nextCourseDate"
              @input="mutDate = $event"
              name="date"
            )
          .field
            span.before-input en
            InputFlat(
              placeholder="Salle"
              :value="nextCourseRoom"
              @input="mutRoom = $event"
              name="room"
            )
        .row.notes
            HeadingSub Notes additionnelles
            TextBlockInput(name="notes")
        ArrayButtonReg.row.buttons
            ButtonRegSecondary(close-modal) Annuler
            ButtonRegPrimary(@mouseup.native="addExercise") Ajouter
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
      mutSubject: this.subject,
      mutDate: "",
      mutRoom: "",
      exerciseName: "",
    };
  },
  computed: {
    ...mapGetters({
      nextCourseOf: "schedule/nextCourseOf"
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
        this.mutDate = val
        return val;
      }
      return "";
    },
    nextCourseRoom() {
      if (this.nextCourse) {
        let val = this.nextCourse.room;
        this.mutRoom = val
        return val;
      }
      return "";
    }
  },
  methods: {
    pickSubject($event) {
      this.mutSubject = $event;
      this.mutDate = this.nextCourseDate
      this.mutRoom = this.nextCourseRoom
      document
        .getElementById("modal_add-exercise-subject-picker")
        .classList.remove("opened");
    },
    async addExercise() {
      //TODO: add to the store using the mutation ADD_EXERCISE
      let errs = []
      console.log(`adding exercise: \
[${this.mutSubject.abbreviation.toUpperCase()}] \
${this.exerciseName} due for ${this.mutDate} @ ${this.mutRoom}`)
      // --- validate data ---
      // check for existence & non-emptiness of fields...
      if (!this.exerciseName) {
        errs.push("Donnez un nom à ce devoir")
      }
      if ("_isPlaceholder" in this.mutSubject) {
        errs.push(`Sélectionnez une matière`)
      }
      if(!this.mutRoom) {
        errs.push(`Choisissez une salle dans laquelle le devoir devra être rendu`)
      }
      if(!this.mutDate) {
        errs.push(`Choisissez une date limite`)
      } else {
        // check for date validity
        let parsedDate = moment(this.mutDate, 'DD/MM/YYYY')
        // is correct format
        if(!parsedDate.isValid()) {
          errs.push('Choisissez une date valide, au format JJ/MM/AAAA')
        // is in the future
        } else if (!parsedDate.isAfter(moment())) {
          errs.push('La date limite doit être dans le futur, Marty! Tu veux créer un paradoxe temporel‽')
        }
      }
      // if any errors: inform the user, and quit
      if (errs.length) {
        errs.forEach(err => this.$toast.error(err))
        return
      }

      try {
        const { data } = await this.$axios.post("/exercises/", {
          subject: this.mutSubject.slug,
          name: this.exerciseName,
          due: moment(this.mutDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          room: this.mutRoom,
          created: moment().toISOString(),
          notes: this.notes,
          completed: false
        })
        this.$toast.success(`Exercice "${this.exerciseName}" ajouté!`)
        // --- close modal manually ---
        document.getElementById(`modal_add-exercise`).classList.remove('opened')
      } catch (error) {
        this.$toast.error(`Erreur lors de l'ajout de l'exercice: ${error}`)
      }

    }
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.row
    display: flex
.row.top
    display: grid
    grid-template-columns: 100px 1fr
    grid-gap: 5px
.row:not(.buttons)
    margin-bottom: 30px
.row:not(.notes)
    align-items: center
.row.buttons, .row.notes
    justify-content: center
.row.notes
    flex-direction: column
.InputFlat /deep/ label
  display: none
.InputFlat
    font-size: 24px
    +desktop
      font-size: 28px
    &.input_name, &.input_name /deep/ input
      overflow: hidden
      text-overflow: ellipsis
      height: 50px //TODO: this is a fix for cut "g"s, move from here
    &.input_date, &.input_date /deep/ input
      width: 190px
    &.input_room, &.input_room /deep/ input
      width: 110px
.BadgeSubject
    margin-right: 10px

.row.context
  .field
    display: flex
    align-items: center
  +tablet
    display: flex
    justify-content: center
    .field
      justify-content: center
      margin-right: 20px
  +phone
    display: block

  .InputFlat /deep/ input
    font-weight: bold
    font-family: 'Roboto Mono', monospace
.row.buttons
  +phone
    padding: 0
    flex-direction: column
    justify-content: center
    .BaseButtonReg
      justify-content: center
      width: calc(100% - 10px)
      text-align: center
      margin-bottom: 10px

.before-input
  font-size: 36px
  margin-right: 5px

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


</style>