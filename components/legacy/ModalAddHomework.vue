<template lang="pug">
  ModalObject(
    v-bind="{...description, action, validation}"
    @submit="$emit('submit')"
    @delete="$emit('delete')"
  )
    PickerSubject(v-bind="{namespace}" @pick="$emit('input', {...valueWithDue, subject: $event})")
    .header
      BadgeSubject(
        clickable
        @click="$modal.show(`${namespace}-subject-picker`)"
        v-bind="value.subject"
        variant="responsive"
      )
      InputField.name(
        :value="value.name"
        @input="$emit('input', {...valueWithDue, name: $event})"
        name="name"
        v-bind="{validation}"
        placeholder="Titre"
        no-error-messages, no-label
        variant="filled"
      )
    .-side-by-side
      .left
        InputField.details(
          :value="value.details"
          @input="$emit('input', {...valueWithDue, details: $event})"
          v-bind="{validation}"
          name="details" 
          type="block"  
          variant="filled"
        ) Détails
      .right
        RadioButtons.type(
          :value="value.type"
          @input="$emit('input', {...valueWithDue, type: $event})"
          v-bind="{validation}"
          name="type"
          variant="filled"
          :values="types" 
        ) Type de devoir
        PickerDateDue(
          variant="filled"
          :value="due"
          @input="$emit('input', {...valueWithDue, due: $event})"
          :subject="value.subject"
          v-bind="{namespace}"
        ) À {{dueLabelVerb}} pour le

</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { fromUnixTime } from 'date-fns'
import ModalObject from '~/components/legacy/ModalObject.vue'
import PickerSubject from '~/components/legacy/PickerSubject.vue'
import HeadingSub from '~/components/legacy/HeadingSub.vue'
import RadioButtons from '~/components/legacy/RadioButtons.vue'
import InputField from '~/components/legacy/InputField.vue'
import ButtonNormal from '~/components/legacy/ButtonNormal.vue'
import BadgeSubject from '~/components/legacy/BadgeSubject.vue'
import PickerDateDue from '~/components/legacy/PickerDateDue.vue'

export default {
  components: {
    ModalObject,
    PickerSubject,
    HeadingSub,
    RadioButtons,
    InputField,
    ButtonNormal,
    BadgeSubject,
    PickerDateDue,
  },
  props: {
    value: {
      type: Object,
      default: null,
    },
    action: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      description: {
        name: 'homework',
        verboseName: 'devoir',
        gender: 'M',
      },
    }
  },
  computed: {
    ...mapState('homework', ['types']),
    ...mapGetters('schedule', ['currentSubject', 'nextCourseOf']),
    validation() {
      return this.validate()(this.valueWithDue)
    },
    dueLabelVerb() {
      return {
        EXERCISE: 'faire',
        TOBRING: 'apporter',
        COURSEWORK: 'faire',
        TEST: 'réviser',
      }[this.value.type]
    },
    namespace() {
      return this.action + '-' + this.name
    },
    due() {
      let date = null
      if (typeof date === 'number') {
        date = fromUnixTime(date)
      }
      if (this.value.due) date = this.value.due
      const nextCourse = this.nextCourseOf(this.value.subject)
      if (nextCourse && !date) {
        date = nextCourse.start
      }
      if (typeof date === 'number') {
        date = fromUnixTime(date)
      }
      return date
    },
    valueWithDue() {
      return { ...this.value, due: this.due }
    },
  },
  methods: {
    ...mapGetters('homework', ['validate']),
  },
}
</script>

<style lang="stylus" scoped>
.content
  display grid
  height 100%
  grid-template-rows 1fr 3fr 1fr

.header
  display flex
  align-items center

  @media (max-width: 650px)
    flex-direction column
    justify-content center

  .subject
    margin-right 0.5em

    @media (min-width: 651px)
      max-width 33%
      font-size 1.75rem

    @media (max-width: 650px)
      margin-bottom 1.5rem
      width 100%
      font-size 1.25rem

  .name
    width 100%

.details
  height 100%

.type
  flex-direction column

  & /deep/ .RadioButton:not(:last-child)
    margin-bottom 0.5em

  margin-top 0.75em //FIXME: Pixel perfect. (to vertically line it up w/ the .details field)
  margin-bottom 1em

.due.active
  & /deep/ label
    top 0

.submit-area
  display flex
  justify-content flex-end
  align-items flex-end
  margin-top 2rem
</style>
