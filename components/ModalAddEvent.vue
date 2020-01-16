<template lang="pug">
  BaseModal(
    name="add-event"
    title="Ajouter un cours..."
  )
    .subject
      PickerSubject(v-bind="subject" @pick="subject = $event" namespace="add-event")
      BadgeSubject.badge(
        v-bind="subject"
        @click="$modal.show('add-event-subject-picker')" 
        clickable no-tooltip
      )
    .weektype
      RadioButtons(v-model="week_type" :values="week_types", name="week_type" v-bind="{validation}") Semaine
    .day
      RadioButtons(v-model="day" :values="days" name="day" v-bind="{validation}") Jour
    .room
      InputField(v-model="room") Salle
    .timeframe
      InputField(
        name="start" 
        type="time" v-model="start"  v-bind="{validation}"
        no-action-button no-error-messages
      ) Début
      Icon trending_flat
      InputField(
        name="end" 
        type="time" v-model="end"  v-bind="{validation}"
        no-action-button no-error-messages
      ) Fin
    .duration
      | Durée: 
      input(
        name="duration" 
        type="time" v-model="duration"  v-bind="{validation}"
      )
    ul.non-field-errors(v-if="!validation.validated")
      li(v-for="error in validation.errors.nonFieldErrors") {{ error }}
    .submit
      ButtonNormal(variant="outline" @click="$modal.hide('add-event')") Annuler
      ButtonNormal(variant="primary" v-bind="{validation}" @click="$emit('post', eventObject); $modal.hide('add-event')") Ajouter

</template>

<script>
import BaseModal from '~/components/BaseModal.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import InputField from '~/components/InputField.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import RadioButtons from '~/components/RadioButtons.vue'
import Icon from '~/components/Icon.vue'
import { parse } from 'date-fns/esm'
import { differenceInSeconds, format } from 'date-fns'
import { mapGetters } from 'vuex'

export default {
  components: { BaseModal, ButtonNormal, InputField, PickerSubject, BadgeSubject, RadioButtons, Icon },
  data() {
    return {
      subject: null,
      week_type: 'BOTH',
      week_types: [
        { key: 'BOTH', label: 'Les deux' },
        { key: 'Q1', label: 'Q1' },
        { key: 'Q2', label: 'Q2' },
      ],
      day: null,
      days: [ 
        { key: 1, label: 'Lu' },
        { key: 2, label: 'Ma' },
        { key: 3, label: 'Me' },
        { key: 4, label: 'Je' },
        { key: 5, label: 'Ve' },
        { key: 6, label: 'Sa' },
        { key: 7, label: 'Di' },
      ],
      start: null,
      end: null,
      room: null
    }
  },
  computed: {
    duration: {
      get() {
        let { start, end } = this.eventObject
        if (!(start && end)) return null
        const seconds = differenceInSeconds(
          parse(end, 'HH:mm:ss', Date.now()),
          parse(start, 'HH:mm:ss', Date.now())
        )
        let hours = ~~(seconds / 3600)
        let minutes = ~~(seconds / 60) - (hours * 60)
        hours = hours.toString().padStart(2, "0")
        minutes = minutes.toString().padStart(2, "0")
        return `${hours}:${minutes}`
      },
      set(duration) {
        let { start, end } = this.eventObject
        if (!start && !end) return null
        const toSeconds = timeStr => {
          let [hours, minutes] = timeStr.split(':').map(n => Number(n))
          let ret = hours * 3600 + minutes * 60
          return ret
        }
        const toSplitted = seconds => {
          let hours = ~~(seconds / 3600)
          let minutes = ~~(seconds / 60) - (hours * 60) 
          let ret = [hours, minutes].map(n => n.toString().padStart(2, '0'))
          return ret
        }
        let sDuration = toSeconds(duration)
        if (!start && end) {
          let sEnd = toSeconds(this.end)
          let [h, m] = toSplitted(sEnd - sDuration)
          this.start = h + ':' + m
        } else if (start) {
          let sStart = toSeconds(this.start)
          let [h, m] = toSplitted(sStart + sDuration)
          this.end = h + ':' + m
        }
      },
    },
    eventObject() {
      return {
        subject: this.subject,
        start: this.addSeconds(this.start),
        end: this.addSeconds(this.end),
        day: this.day,
        week_type: this.week_type,
        room: this.room
      }
    },
    validation() {
      return this.validateEvent()(this.eventObject)
    }
  },
  methods: {
    ...mapGetters('schedule', ['validateEvent']),
    addSeconds(timeStr) {
      return timeStr ? timeStr + ':00' : null
    },
  }
}
</script>

<style lang="stylus" scoped>
time-input-width = 7em
.subject, .day, .duration, .weektype, .room
  margin-bottom 2em
.subject
  .badge
    width: 100%
.timeframe
  display flex
  align-items center
  justify-content center
  // @media (max-width 600px)
  //   flex-direction column
  .field
    width time-input-width
  & > *:not(:last-child)
    margin-right 1rem
  // .field /deep/ input
  //   max-width time-input-width
  //   min-width time-input-width
  & /deep/ i
    font-size 2rem
    padding-top 1.1rem //FIXME: manual vertical centering...
.duration
  margin-top 1em
  display flex
  justify-content center
.non-field-errors
  margin-bottom 2em
  color var(--red)
  text-align center
.submit
  display flex
  justify-content flex-end
</style>
