<!-- eslint-disable -->
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
          //FIXME #73: the step value causes the scroll to 
          // increase by ridiculously small steps.
          // consider using a custom JS implementation
          // with InputField type="number" variant="transparent"
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
      variant="primary"
      @click="$emit('submit', gradeObject); resetInputs()"
      :validation="validate()(gradeObject)"
    ) {{ grade ? 'Modifier' : 'Ajouter' }}
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import BaseModal from '~/components/legacy/BaseModal.vue'
import BadgeSubject from '~/components/legacy/BadgeSubject.vue'
import InputField from '~/components/legacy/InputField.vue'
import PickerSubject from '~/components/legacy/PickerSubject.vue'
import ButtonNormal from '~/components/legacy/ButtonNormal.vue'
export default {
  components: {
    BaseModal,
    BadgeSubject,
    InputField,
    PickerSubject,
    ButtonNormal,
  },
  props: {
    grade: {
      type: Object,
      default: null,
    },
    modalName: {
      type: String,
      default: 'add-grade',
    },
  },
  data() {
    return {
      obtained: null,
      expected: null,
      unit: this.setting()('grades_unit'),
      weight: this.setting()('default_grade_weight'),
      goal: null,
      subject: null,
      name: null,
    }
  },
  computed: {
    ...mapState(['now']),
    gradeObject() {
      const obtainedDate = this.obtained !== null ? this.now : null
      return {
        obtained: this.normalizeGrade(this.obtained),
        expected: this.normalizeGrade(this.expected),
        goal: this.normalizeGrade(this.goal),
        unit: this.unit,
        weight: this.weight,
        subject: this.subject,
        name: this.name,
        obtained_date: obtainedDate,
      }
    },
  },
  watch: {
    grade() {
      if (this.grade) {
        // eslint-disable-next-line
        const {
          unit,
          obtained,
          expected,
          goal,
          weight,
          subject,
          name,
          // eslint-disable-next-line camelcase
          obtained_date,
        } = this.grade
        this.obtained = obtained * unit
        this.expected = expected * unit
        this.goal = goal * unit
        this.name = name
        this.subject = subject
        this.weight = weight
        this.unit = unit
        // eslint-disable-next-line
        this.obtained_date = obtained_date
      }
    },
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('settings/load')
    })
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
      this.obtained = null
      this.expected = null
      this.unit = this.setting()('grades_unit')
      this.weight = this.setting()('default_grade_weight')
      this.goal = null
      this.subject = null
      this.name = null
    },
  },
}
</script>

<style lang="stylus" scoped>
.obtained-grade
  display flex
  justify-content center
  align-items center
  margin 1.5em 0
  font-size 2.5rem

.other-grades
  display flex
  flex-direction column
  margin-top 1.5rem

  input
    width 3.25em

    &:not(:last-child)
      margin-bottom 0.2em

input
  width 100%
  font-family var(--fonts-monospace)

.fraction
  display flex
  flex-direction column
  justify-content center
  width 3.25em
  text-align center

  .denominator
    margin-top 0.2em
    padding-top 0.2em
    border-top 0.075em solid var(--black)

  input
    text-align center

.multiplication
  .weight
    width 2.5em

  .operator
    margin 0 0.2em

.grade
  display flex
  border-radius var(--border-radius)

.header
  display flex
  align-items center

  @media (max-width: 650px)
    flex-direction column
    justify-content center

  .subject
    margin-right 0.5em
    font-size 1.25rem

    @media (max-width: 650px)
      margin-bottom 1.5rem
      font-size 1.5rem

    &.dot
      font-size 2em

  .name
    width 100%

.submit
  display flex
  justify-content flex-end
</style>
