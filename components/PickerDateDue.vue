<template lang="pug">
  .picker-date-input(:class="{'picker-opened': opened}")
    InputField(
      type="date"
      :name="name + '-input'"
      @input="$emit('input', $event)"
      v-bind="{value, variant}"
      :action-icon="'keyboard_arrow_' + (opened ? 'up' : 'down')"
      @action="modalAction()"
    )
      slot
    BaseModal(
      v-bind="{name}"
      no-backdrop shadow :close-button="false"
      @close="opened = false"
    )
      template(v-if="subject")
        HeadingSub(small) Prochains cours
        .next-courses
          button.before(@click="$emit('input', courseBefore)" :disabled="!courseBefore" type="button")
            Icon arrow_back
          .viewer
            span.relative {{ dueRelative || '?!?' }}
            span.absolute {{ value ? format(value, 'cccc dd MMM à HH:mm') : 'Aucune date sélectionnée' }}
          button.after(@click="$emit('input', courseAfter)" :disabled="!courseAfter" type="button")
            Icon arrow_forward
        .buttons
          ButtonNormal(
            @click="$emit('input', nextCourse)"
            :disabled="!nextCourse"
            smaller
          ) Prochain cours
          ButtonNormal(
            @click="$emit('input', nextWeekCourse)"
            :disabled="!nextWeekCourse"
            smaller
          ) Semaine pro.
      template(v-else)
        .next-courses Veuillez sélectionner une matière

</template>

<script>
import {
  format,
  formatISO,
  isBefore,
  isAfter,
  isSameWeek,
  formatDistance,
  isToday,
  isTomorrow,
  differenceInDays,
  isValid,
  addWeeks,
  isSameDay,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { mapGetters, mapState } from 'vuex'
import BaseModal from '~/components/BaseModal.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import Icon from '~/components/Icon.vue'
import InputField from '~/components/InputField.vue'
import HeadingSub from '~/components/HeadingSub.vue'

export default {
  components: { BaseModal, ButtonNormal, Icon, InputField, HeadingSub },
  props: {
    subject: Object,
    namespace: {
      type: String,
      default: null,
    },
    variant: {
      type: String,
      default: 'outline',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Date, Number],
      default: null,
    },
  },
  data() {
    return {
      opened: false,
    }
  },
  computed: {
    ...mapState(['now']),
    ...mapGetters('schedule', [
      'nextCoursesIn',
      'coursesIn',
      'nextCourseOf',
      'coursesOf',
    ]),
    name() {
      return this.namespace
        ? `${this.namespace}-due-date-picker`
        : 'subject-picker'
    },
    courses() {
      return this.coursesOf(this.subject, 'subject')
    },
    courseBefore() {
      if (this.subject && this.value) {
        const courses = this.coursesIn(addWeeks(this.value, -1), this.value)
          .filter(c => c.subject.uuid === this.subject.uuid)
          .sort((c1, c2) => isBefore(c1.start, c2.start))
          .filter(c => !isSameDay(c.start, Date.now()))
          .filter(c => !isSameDay(c.start, this.value))
          .filter(c => isBefore(Date.now(), c.start))
        console.log(
          'courseBefore::' +
            courses
              .map(c => formatISO(c.start, { representation: 'date' }))
              .join('|')
        )
        if (courses.length) return courses[0].start
      }
      return null
    },
    courseAfter() {
      if (this.subject && this.value) {
        const courses = this.nextCoursesIn(this.value, addWeeks(this.value, 2))
          .filter(c => c.subject.uuid === this.subject.uuid)
          .sort((c1, c2) => isAfter(c1.start, c2.start))
        console.log(
          'courseAfter::' +
            courses
              .map(c => formatISO(c.start, { representation: 'date' }))
              .join('|')
        )
        if (courses.length) return courses[0].start
      }
      return null
    },
    nextCourse() {
      if (this.subject === null) return null
      const course = this.nextCourseOf(this.subject)
      return course ? course.start : null
    },
    nextWeekCourse() {
      if (this.subject) {
        const courses = this.nextCoursesIn(Date.now(), addWeeks(Date.now(), 1))
          .filter(c => !isSameWeek(c.start, Date.now()))
          .filter(c => c.subject.uuid === this.subject.uuid)
        if (courses.length) return courses[0].start
      }
      return null
    },
    dueRelative() {
      if (this.value && isValid(this.value)) {
        if (isToday(this.value)) return "Aujourd'hui"
        if (isTomorrow(this.value)) return 'Demain'
        const daysDiff = differenceInDays(this.dat, this.now)
        if (daysDiff % 7 === 0)
          return daysDiff / 7 + ' semaine' + (daysDiff / 7 > 1 ? 's' : '')
        return formatDistance(this.value, this.now, {
          locale: fr,
          addSuffix: false,
        })
      }
      return null
    },
  },
  methods: {
    format(date, fmt) {
      return this.toTitleCase(format(date, fmt, { locale: fr }))
    },
    modalAction() {
      if (this.opened) {
        this.$modal.hide(this.name)
        this.opened = false
      } else {
        this.$modal.show(this.name, {
          at: 'self.below.left',
          from: this.$el.querySelector('input'),
          stretch: 'width',
        })
        this.opened = true
      }
    },
    toTitleCase(str) {
      return str.replace(
        /\w\S*/g,
        txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
    },
  },
}
</script>

<style lang="stylus" scoped>
side-padding = 0.75rem

.BaseModal /deep/ .modal-wrapper
  padding side-padding
  border-top-left-radius 0
  border-top-right-radius 0

h3
  margin-bottom 0

.next-courses
  display flex
  align-items center

  spinner-buttons-width = 1.75rem
  spinner-buttons-spacing = 0.5rem
  spinner-buttons-height = 4rem

  .viewer
    display flex
    flex-direction column
    justify-content center
    width 'calc(100% - (%s * 2) - (%s * 2))' % (spinner-buttons-width spinner-buttons-spacing)
    height spinner-buttons-height
    text-align center

    .relative
      font-weight 500
      font-size 1.3em

    .absolute
      font-size 0.9em
      opacity 0.25

  button
    &
      height spinner-buttons-height

    &[disabled] i
      color var(--grey-offset)

    &.before
      margin-right spinner-buttons-spacing

    &.after
      margin-left spinner-buttons-spacing

    i
      color var(--black)
      font-size spinner-buttons-width

.buttons
  display flex
  justify-content space-between

  .button /deep/ button
    margin 0

  .button:not(:last-child)
    margin-right 1em

.picker-opened
  .field /deep/ button
    border-bottom-right-radius 0
    border-bottom-left-radius 0
</style>
