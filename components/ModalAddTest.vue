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
              InputFlat(
                name="date", 
                placeholder="JJ/MM/AAAA"
                :value="nextCourseDate",
                @input="mutDate = $event"
              )
            .field
              span.before-input en
              InputFlat(
                name="room", 
                placeholder="Salle"
                :value="nextCourseRoom",
                @input="mutRoom = $event"
              )
            .field
              span.before-input sur
              InputFlat(
                name="grade-max"
                :value="defaultMax", 
                @input="mutMax = $event"
              )
            .field
              span.before-input coef
              InputFlat(
                name="grade-weight"
                :value="defaultWeight", 
                @input="mutWeight = $event"
              )
        .row.main
            .notes
              HeadingSub À apprendre
              select(
                name="notes"
                v-model="selectedNotes"
                multiple
              )
                //TODO: select by default the latest-created note that doesn't have a grade linked
                option(v-for="(note, i) in notes" :key="i" :value="note.uuid") {{ note.name }}
              //TODO: list of dropdowns w/ each note of subject as option || list of <input>'s
            .details
              HeadingSub Notes additionnelles
              TextBlockInput(
                name="details"
                v-model="details"
              )
        ArrayButtonReg.row.buttons
            ButtonRegSecondary(close-modal) Annuler
            ButtonRegPrimary(@mouseup.native="addTest") Ajouter
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
      mutSubject: this.subject,
      mutDate: "",
      mutRoom: "",
      mutWeight: "",
      mutRoom: "",
      details: "",
      selectedNotes: []
    };
  },
  computed: {
    ...mapGetters({
      nextCourseOf: "schedule/nextCourseOf",
      setting: "schedule/setting",
      notesOf: "notes/notesOf",
      allNotes: "notes/allNotes"
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
    },
    defaultMax() {
      let val = this.setting("default_max") || "";
      this.mutMax = val
      return val
    },
    defaultWeight() {
      let val = this.setting("default_weight") || "";
      this.mutWeight = val
      return val
    },
    notes() {
      let notes = this.notesOf(this.mutSubject.slug)
      return notes
    }
  },
  methods: {
    pickSubject($event) {
      this.mutSubject = $event;
      document
        .getElementById("modal_add-test-subject-picker")
        .classList.remove("opened");
      // deselect all elements upon switching subjects        
      document.querySelectorAll("#modal_add-test select option").forEach(e => {
        e.removeAttribute('selected')
      })
    },
    async addTest() {
        //TODO: add new note when notes to learn
        //      don't exist, or allow for non-registered
        //      ghost notes that won't appear in /notes/
        //TODO: add subject (as a test could have no notes linked to)
        
        let errs = []
        console.log(`adding test: \
  [${this.mutSubject.abbreviation.toUpperCase()}] \
  ${this.selectedNotes.join(',')} due for ${this.mutDate} @ ${this.mutRoom}`)
        // --- validate data ---
        // check for existence & non-emptiness of fields...
        if ("_isPlaceholder" in this.mutSubject) {
          errs.push(`Sélectionnez une matière`)
        }
        if(!this.mutRoom) {
          errs.push(`Choisissez une salle dans laquelle le devoir devra être rendu`)
        }
        if(!this.mutMax) {
          errs.push(`Choisissez l'unité de cette note (vous pouvez changer cela plus tard)`)
        }
        if(!this.mutWeight) {
          errs.push(`Choisissez le coefficient de la note (vous pouvez changer cela plus tard)`)
        }
        if(!this.mutDate) {
          errs.push(`Choisissez la date du contrôle`)
        } else {
          // check for date validity
          let parsedDate = moment(this.mutDate, 'DD/MM/YYYY')
          // is correct format
          if(!parsedDate.isValid()) {
            errs.push('Choisissez une date valide, au format JJ/MM/AAAA')
          // is in the future
          } else if (!parsedDate.isAfter(moment())) {
            errs.push('La date du contrôle doit être dans le futur, Marty! Tu veux créer un paradoxe temporel‽')
          }
        }
        // if any errors: inform the user, and quit
        if (errs.length) {
          errs.forEach(err => this.$toast.error(err))
          return
        }

        try {
          const { data } = await this.$axios.post("/tests/", {
            subject: this.mutSubject.slug,
            due: moment(this.mutDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            room: this.mutRoom,
            created: moment().toISOString(),
            notes: this.selectedNotes,
            details: this.details
          })

          const response = await this.$axios.post("/grades/", {
            weight: this.mutWeight,
            maximum: this.mutMax,
            test: data.uuid
          })

          this.$store.commit('homework/ADD_TEST', data)
          this.$store.commit('homework/ADD_GRADE', response.data)
          this.$toast.success(`Contrôle de ${this.mutSubject.name} ajouté!`)
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
  .notes /deep/ select
    width: 100%
    option
      font-size: 24px
  +tablet
    display: grid
    grid-template-columns: repeat(2, 400px)
    grid-gap: 20px
  +phone
    display: flex
    flex-direction: column
    align-items: flex-start
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
    max-height: calc(100vh - 20px)
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