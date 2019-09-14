<template lang="pug">
BaseCard.CardSubject(:style="{backgroundColor: mutColor, color: textColor}", :class="{editing}")
  //TODO: type in the name of the subject to confirm deletion
  ModalDialogConfirm.confirm-delete(:name="`delete-subject-${uuid}`" confirm-role="danger" confirm-text="Supprimer" @confirm="editing = false; $emit('editing-finished', subject); deleteSubject()")
    | Supprimer cette matière supprimera #[strong tout] ce qui était en lien avec:
    br
    | &nbsp; &bull; devoirs, #[br]
    | &nbsp; &bull; contrôles, #[br]
    | &nbsp; &bull; évenements dans l'emploi du temps et #[br]
    | &nbsp; &bull; prises de notes #[br]
    br
    | Cette action est #[strong irréversible]
  p.name 
    input(v-model="mutName" placeholder="Nom de la matière...")
    //-TODO: close button reverts values to those passed in props
    ButtonIcon.edit-button(@click="toggleAndCancel()" :color="textColor" v-if="uuid !== 'new' && !noEditButton") {{ editing ? 'close' : 'edit' }}
  .row
    .field
      LabelFlat Abbreviation*
      input.abbreviation(maxlength="3" v-model="mutAbbreviation" placeholder="ABC")
    .field
      LabelFlat Couleur*
      PickerColor.color(
        v-model="mutColor"
        :color="textColor"
        :modal-id="uuid"
      )
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
    ButtonIcon.delete-button(:open-modal="`confirm-delete-subject-${uuid}`" open-at="center" :color="textColor" v-if="uuid !== 'new'") delete
    ButtonIcon.confirm-button(@click="editing = false; $emit('editing-finished', subject); uploadChanges()" :color="textColor") check
</template>

<script>
import BigNumber from "~/components/BigNumber.vue";
import ButtonIcon from "~/components/ButtonIcon.vue";
import LabelFlat from "~/components/LabelFlat.vue";
import PickerColor from "~/components/PickerColor.vue";
import ModalDialogConfirm from '~/components/ModalDialogConfirm.vue'
import BaseCard from "~/components/BaseCard.vue";
import InputFlat from '~/components/InputFlat.vue'
import { mapGetters } from 'vuex';
import tinycolor from 'tinycolor2'
import debounce from 'lodash.debounce'
import slugify from 'slugify'

export default {
  name: "CardSubject",

  components: {
    BigNumber,
    ButtonIcon,
    LabelFlat,
    InputFlat,
    PickerColor,
    ModalDialogConfirm,
    BaseCard,
  },

  props: {
    color: String,
    name: String,
    uuid: String,
    grade_goal: Number,
    room: String,
    physical_weight: Number,
    abbreviation: String,
    slug: String,
    noEditButton: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      editing: false,
      mutColor: this.color,
      mutName: this.name,
      mutGrade_goal: this.grade_goal,
      mutRoom: this.room,
      mutPhysical_weight: this.physical_weight || 0,
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
        abbreviation: this.mutAbbreviation.toLowerCase(),
        slug: this.slug || slugify(`${this.$auth.user.username}--${this.mutName}`).toLowerCase()
      }
    },
  },

  methods: {
    toggleAndCancel() {
      if (this.editing) {
        this.mutColor = this.$props.color
        this.mutName = this.$props.name
        this.mutGrade_goal = this.$props.grade_goal
        this.mutRoom = this.$props.room
        this.mutPhysical_weight = this.$props.physical_weight
        this.mutAbbreviation = this.$props.abbreviation
        this.mutSlug = this.$props.slug
      }
      this.editing = !this.editing
    },
    uploadChanges: debounce(function() {
      try {
        let res;
        if (this.uuid === 'new') {
          res = this.$axios.post(`/subjects/`, this.subject)
          this.$store.commit('ADD_SUBJECT', res.data)
        } else {
          res = this.$axios.patch(`/subjects/${this.uuid}/`, this.subject)
          this.$store.commit('UPDATE_SUBJECT', {uuid: this.uuid, data: res.data})
        }
      } catch (error) {
        let verb
        if (this.uuid === 'new') {
          verb = 'création'
        } else {
          verb = 'modification'
        }
        this.$toast.error(`Erreur lors de la ${verb} de la matière: ${error}`)
      }
    }, 500),
    deleteSubject() {
      try {
        this.$axios.delete(`subjects/${this.uuid}/`)
        this.$store.commit('DELETE_SUBJECT', this.uuid)
      } catch (error) {
        this.$toast.error(`Erreur lors de la suppression de la matière: ${error}`)
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.CardSubject
  width 600px
  max-width 100%
  padding 20px
  height: 300px
  @media (max-width: 1000px)
    height: 400px
  overflow hidden
  &:not(.editing)
    height 75px
  transition height 0.25s ease

.confirm-delete /deep/ .message
  text-align left

// Fix some colors
.BigNumber /deep/ *, input
  color inherit

.BigNumber
    margin-top: -5px
    line-height 36px !important
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

//TODO: make a new <LabelFlat> (call it <LabelAlt>)
.LabelFlat
  text-transform none !important
  opacity 1 !important
  font-weight normal !important
  font-size: 22px !important

.row
  display grid
  grid-template-columns repeat(3, 200px)
  @media (max-width 1000px)
    grid-template-columns repeat(2, 50%)
  grid-gap 10px
  margin-top: 25px

.button-row
  position relative

.confirm-button, .delete-button
  position absolute
.confirm-button
  @media (min-width 1001px)
    right 0px
    top -20px
  @media (max-width 1000px)
    right 0
    top calc(-40px + 40px)
  & /deep/ .icon
    font-size: 48px

.delete-button
  @media (min-width 1001px)
    right 65px
    top -10px
  @media (max-width 1000px)
    left 0px
    top calc(-30px + 40px)
  & /deep/ .icon
    font-size: 32px

.edit-button /deep/ .icon
    font-size: 36px

.name
  font-size: 28px
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