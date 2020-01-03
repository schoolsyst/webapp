<template lang="pug">
BaseModal.grade(:name="modalName" :title="(grade ? 'Modifier' : 'Ajouter') + ' une note...'")
  PickerSubject(
    :namespace="modalName"
    @pick="subject = $event"
  )
  .header
    BadgeSubject(
      clickable
      @click="$modal.show(`${modalName}-subject-picker`)"
      v-bind="subject"
      variant="responsive"
    )
    InputField.name(
      v-model="name"
      placeholder="Nom de la note..."
      no-error-messages
      no-label
      variant="filled"
    )
  .-side-by-side
    .obtained-grade
      .fraction
        // comment #1
        //FIXME: the step value causes the scroll to 
        // increase by ridiculously small steps.
        // consider using a custom JS implementation
        // with <InputField type="number" variant="transparent">
        input.numerator(
          type="number"
          label="numerator"
          v-model="obtained"
          placeholder="?"
          min="0"
          :max="unit"
          step="0.001"
        ) 
        input.denominator(
          type="number"
          label="denominator"
          v-model="unit"
          min="1"
          step="0.001"
        )
    .date-and-other-grades
      .other-grades
        InputField(
          v-model="weight"
          type="number"
          name="weight"
          no-action-button
          :validation="validate()(gradeObject)"
          variant="filled"
        ) Coefficient
        InputField(
          v-model="goal"
          type="number"
          name="goal"
          :validation="validate()(gradeObject)"
          variant="filled"
        ) Objectif ({{ unit == 100 ? 'en %' : `sur ${unit}` }})
        InputField(
          v-model="expected"
          type="number"
          name="expected"
          :validation="validate()(gradeObject)"
          variant="filled"
        ) Note estimée ({{ unit == 100 ? 'en %' : `sur ${unit}` }})
  ButtonNormal.submit(
    @click="$emit('submit', gradeObject); resetInputs()"
    :validation="validate()(gradeObject)"
  ) {{ grade ? 'Modifier' : 'Ajouter' }}
</template>

<script>
import BaseModal from '~/components/BaseModal.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import InputField from '~/components/InputField.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import { mapGetters, mapState } from 'vuex'
export default {
  components: {BaseModal, BadgeSubject, InputField, PickerSubject, ButtonNormal},
  props: {
    grade: {
      type: Object,
      default: null
    },
    modalName: {
      type: String,
      default: 'add-grade'
    }
  },
  data() {
    return {
      obtained: null,
      expected: null,
      unit: this.setting()('grades_unit'),
      weight: this.setting()('default_grade_weight'),
      goal: null,
      subject: null,
      name: null
    }
  },
  computed: {
    ...mapState(['now']),
    gradeObject() {
      let obtained_date = this.obtained !== null ? this.now : null
      return {
        obtained: this.normalizeGrade(this.obtained),
        expected: this.normalizeGrade(this.expected),
        goal: this.normalizeGrade(this.goal),
        unit: this.unit,
        weight: this.weight,
        subject: this.subject,
        name: this.name,
        obtained_date
      }
    },
  },
  methods: {
    // Returns a grade in [0; 1]
    normalizeGrade(grade) {
      const normalized = grade / this.unit
      if (isNaN(normalized)) return null
      return normalized
    },
    ...mapGetters('grades', ['validate']),
    ...mapGetters('settings', { setting: 'value' }),
    resetInputs() {
      this.obtained = null,
      this.expected = null,
      this.unit = this.setting()('grades_unit'),
      this.weight = this.setting()('default_grade_weight'),
      this.goal = null,
      this.subject = null,
      this.name = null
    }
  },
  async mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('settings/load')
    })
  },
  watch: {
    grade() {
      console.log('grade prop changed')
      if (this.grade) {
        console.log('Filling modal with data')
        const { unit, obtained, expected, goal, weight, subject, name, obtained_date } = this.grade
        this.obtained = obtained * unit
        this.expected = expected * unit
        this.goal     = goal * unit
        this.name     = name
        this.subject  = subject
        this.weight   = weight
        this.obtained_date = obtained_date
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
.obtained-grade
  display flex
  align-items center
  font-size 2.5rem
  justify-content center
  margin: 1.5em 0
.other-grades
  margin-top 1.5rem
  display flex
  flex-direction column
  input
    width: 3.25em
    &:not(:last-child)
      margin-bottom 0.2em
input
  width: 100%
  font-family var(--fonts-monospace)
.fraction
  display flex
  flex-direction column
  justify-content center
  width 3.25em
  text-align center
  .denominator
    border-top 0.075em solid var(--black)
    margin-top 0.2em
    padding-top: 0.2em
  input
    text-align center
.multiplication
  .weight
    width 2.5em
  .operator
    margin: 0 0.2em
.grade
  display flex
  border-radius var(--border-radius)

.header
  display flex
  align-items center
  @media (max-width 650px)
    flex-direction column
    justify-content center
  .subject
    font-size 1.25rem
    margin-right 0.5em
    @media (max-width 650px)
      margin-bottom: 1.5rem
      font-size: 1.5rem
    &.dot
      font-size 2em
  .name
    width 100%

.submit
  display flex
  justify-content flex-end
</style>
