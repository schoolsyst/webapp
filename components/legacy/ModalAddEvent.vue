<template lang="pug">
  ModalObject(
    v-bind="{...description, action, validation}"
    @submit="$emit('submit')"
    @delete="$emit('delete')"
  )
    .subject
      PickerSubject(
        @pick="$emit('input', {...value, action, subject: $event })"
        :namespace="modalName"
      )
      BadgeSubject.badge(
        v-bind="value.subject || {}"
        @click="$modal.show(modalName + '-subject-picker')"
        clickable no-tooltip
      )
    .weektype
      RadioButtons(
        :value="value.week_type"
        @input="$emit('input', {...value, action, week_type: $event })"
        :values="week_types"
        name="week_type"
        v-bind="{validation}"
      ) Semaine
    .day
      RadioButtons(
        :value="value.day"
        @input="handleDayInput($event)"
        :values="days"
        name="day"
        v-bind="{validation}"
      ) Jour
    .room
      InputField(
        :value="value.room"
        @input="$emit('input', {...value, action, room: $event })"
        name="room"
        v-bind="{validation}"
      ) Salle
    .timeframe
      InputField(
        name="start"
        type="time"
        :value="removeSeconds(value.start)"
        @input="$emit('input', { ...value, action, start: addSeconds($event) })"
        v-bind="{validation}"
        no-action-button no-error-messages
      ) Début
      Icon trending_flat
      InputField(
        name="end"
        type="time"
        :value="removeSeconds(value.end)"
        @input="$emit('input', { ...value, action, end: addSeconds($event) })"
        v-bind="{validation}"
        no-action-button no-error-messages
      ) Fin
    //-.duration
      | Durée:
      input(
        name="duration"
        type="time"
        v-model="duration"
        v-bind="{validation}"
      )
    ul.non-field-errors(v-if="!validation.validated")
      li(v-for="error in validation.errors.nonFieldErrors") {{ error }}

</template>

<script>
// eslint-disable-next-line no-unused-vars
import { differenceInSeconds, format, isValid, parse } from 'date-fns'
import { mapGetters } from 'vuex'
import ModalObject from '~/components/legacy/ModalObject.vue'
import ButtonNormal from '~/components/legacy/ButtonNormal.vue'
import InputField from '~/components/legacy/InputField.vue'
import PickerSubject from '~/components/legacy/PickerSubject.vue'
import BadgeSubject from '~/components/legacy/BadgeSubject.vue'
import RadioButtons from '~/components/legacy/RadioButtons.vue'
import Icon from '~/components/legacy/Icon.vue'

export default {
  components: {
    ModalObject,
    ButtonNormal,
    InputField,
    PickerSubject,
    BadgeSubject,
    RadioButtons,
    Icon,
  },
  props: {
    action: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      default: () => ({
        subject: null,
        week_type: 'BOTH',
        day: null,
        start: null,
        end: null,
        room: null,
      }),
    },
  },
  data() {
    return {
      start: null,
      end: null,
      description: {
        name: 'event',
        verboseName: 'cours',
        gender: 'M',
      },
      week_types: [
        { key: 'BOTH', label: 'Les deux' },
        { key: 'Q1', label: 'Semaine paire / Q1' },
        { key: 'Q2', label: 'Semaine impaire / Q2' },
      ],
      days: [
        { key: 1, label: 'Lu' },
        { key: 2, label: 'Ma' },
        { key: 3, label: 'Me' },
        { key: 4, label: 'Je' },
        { key: 5, label: 'Ve' },
        { key: 6, label: 'Sa' },
        { key: 7, label: 'Di' },
      ],
    }
  },
  computed: {
    validation() {
      return this.validateEvent()(this.value)
    },
    modalName() {
      return this.action + '-event'
    },
  },
  methods: {
    ...mapGetters('schedule', ['validateEvent']),
    addSeconds(timeStr) {
      if (!timeStr) return null
      timeStr += ':00'
      return parse(timeStr, 'HH:mm:ss', Date.now())
    },
    removeSeconds(timeVal) {
      if (!timeVal || !isValid(timeVal)) {
        return null
      }
      const timeStr = format(timeVal, 'HH:mm:ss')
      return timeStr.replace(/:\d{2}$/, '')
    },
    handleDayInput($event) {
      console.log(`Updating day from ${this.action} modal`)
      this.$emit('input', {
        ...this.value,
        action: this.action,
        day: $event,
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
time-input-width = 7em

.subject, .day, .duration, .weektype, .room
  margin-bottom 2em

.subject
  .badge
    width 100%

.timeframe
  display flex
  justify-content center
  align-items center

  //@media (max-width 600px)
  //flex-direction column
  .field
    width time-input-width

  & > *:not(:last-child)
    margin-right 1rem

  //.field /deep/ input
  //max-width time-input-width
  //min-width time-input-width
  & /deep/ i
    padding-top 1.1rem //FIXME: manual vertical centering...
    font-size 2rem

.duration
  display flex
  justify-content center
  margin-top 1em

.non-field-errors
  margin-bottom 2em
  color var(--red)
  text-align center

.submit
  display flex
  justify-content flex-end
</style>
