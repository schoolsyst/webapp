<template lang="pug">
  BaseModal(
    v-bind="{name}"
    no-backdrop shadow :close-button="false" edge-to-edge
  )
    .original-input
      InputField(
        type="date"
        :name="name + '-input'"
        v-model="date"
        no-label
        action-icon="keyboard_arrow_up"
        @action="$modal.hide(name)"
        autofocus
      )
    template(v-if="subject")
      HeadingSub(small) Prochains cours
      .next-courses
        button.before(@click="date = courseBefore" :disabled="!courseBefore")
          Icon chevron_left
        .viewer
          span.relative {{ dueRelative || '?!?' }}
          span.absolute {{ date ? format(date, 'cccc dd MMM. à HH:mm') : 'Aucune date sélectionnée' }}
        button.after(@click="date = courseAfter" :disabled="!courseAfter")
          Icon chevron_right
      .buttons
        ButtonNormal(
          @click="date = nextCourse"
          :disabled="!nextCourse"
          smaller
        ) Prochain cours
        ButtonNormal(
          @click="date = nextWeekCourse"
          :disabled="!nextWeekCourse"
          smaller
        ) Semaine pro.
    template(v-else)
      .next-courses Veuillez sélectionner une matière

</template>

<script>
import BaseModal from '~/components/BaseModal.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import Icon from '~/components/Icon.vue'
import InputField from '~/components/InputField.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import { format, formatISO, parseISO, isBefore, isAfter, isSameWeek, formatDistance, isToday, isTomorrow, differenceInDays, isValid, addWeeks } from 'date-fns'
import { fr } from 'date-fns/locale'
import { mapGetters, mapState } from 'vuex'

export default {
  components: {BaseModal, ButtonNormal, Icon, InputField, HeadingSub},
  props: {
    subject: Object,
    due: Date,
    namespace: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      mDate: null
    }
  },
  computed: {
    ...mapState(['now']),
    ...mapGetters('schedule', ['nextCoursesIn', 'prevCoursesIn', 'nextCourseOf']),
    name() {
      return this.namespace ? `${this.namespace}-due-date-picker` : 'subject-picker'
    },
    date: {
      get() { return this.mDate || this.due },
      set(val) { this.mDate = val; this.$emit('input', val) }
    },
    courses() {
      return this.coursesOf(this.subject, 'subject')
    },
    courseBefore() {
      if(this.subject) {
        let courses = this.prevCoursesIn(addWeeks(this.date, -1), this.date)
                          .filter(c => c.subject.uuid === this.subject.uuid)
                          // .filter(c => isBefore(c.start, this.date))
        console.log(courses)
        if (courses.length) return courses[0].start
      }
      return null
    },
    courseAfter() {
      if(this.subject) {
        let courses = this.nextCoursesIn(this.date, addWeeks(this.date, 1))
                          .filter(c => c.subject.uuid === this.subject.uuid)
                          // .filter(c => isAfter(c.start, this.date))
        console.log(courses)
        if (courses.length) return courses[0].start
      }
      return null
    },
    nextCourse() {
      if (this.subject === null) return null
      let course = this.nextCourseOf(this.subject)
      return course ? course.start : null
    },
    nextWeekCourse() {
      if (this.subject) {
        let courses = this.nextCoursesOf(this.subject)
                          .filter(c => !isSameWeek(c.start, this.date))
        if (courses.length) return courses[0].start
      }
      return null
    },
    dueRelative() {
      if (this.date && isValid(this.date)) {
        if (isToday(this.date))
          return "Aujourd'hui"
        if (isTomorrow(this.date))
          return 'Demain'
        let daysDiff = differenceInDays(this.dat, this.now)
        if (daysDiff % 7 === 0)
          return daysDiff/7 + ' semaine' + (daysDiff/7 > 1 ? 's' : '')
        return formatDistance(this.date, this.now, { locale: fr, addSuffix: false })
      }
      return null
    }

  },
  methods: {
    format,
  }
}
</script>

<style lang="stylus" scoped>
side-padding = 0.75rem

.BaseModal /deep/ .modal-wrapper
  padding 0
  padding-bottom (side-padding)
h2
  margin-left (side-padding)
.next-courses
  display flex
  align-items center
  spinner-buttons-width = 2rem
  spinner-buttons-spacing = 0.5rem
  spinner-buttons-height = 4rem
  .viewer
    height spinner-buttons-height
    width "calc(100% - (%s * 2) - (%s * 2))" % (spinner-buttons-width spinner-buttons-spacing)
    display flex
    flex-direction column
    text-align center
    justify-content center
    .relative
      font-weight 500
      font-size: 1.3em
    .absolute
      opacity: 0.25
      font-size: 0.9em
  button 
    &
      height spinner-buttons-height
    &[disabled]
      opacity: 0.25
    &.before
      margin-right spinner-buttons-spacing
    &.after
      margin-left spinner-buttons-spacing
    i
      font-size spinner-buttons-width
  
.next-courses, .buttons
  padding 0 (side-padding)

.buttons 
  display flex
  justify-content space-between
  .button /deep/ button
    margin: 0
  .button:not(:last-child)
    margin-right 1em
</style>
