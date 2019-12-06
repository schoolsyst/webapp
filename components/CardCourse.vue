<template lang="pug">
  .card-wrapper(
    @click="$emit(expanded ? 'closed' : 'expanded')"
    :class="{empty, expanded}"
  )
    .card(
      :style="!empty ? {\
        backgroundColor,\
        color: backgroundColor \
          ? textColor(backgroundColor)() \
          : false\
        } : false"
      :class="{empty, expanded}"
    )
      template(v-if="subject")
        SubjectDot.subject-color(v-bind="subject")
        .infos
          span.subject
            span.subject-name {{ subject.name }}
          .room-and-time 
            .room {{ room }}
        .homework(v-if="currentWeek")
          ul
            li(v-for="hw in currentWeek" :key="hw.uuid")
              .card
                span.name {{ hw.name }}
      template(v-else)
        slot
</template>

<script>
import SubjectDot from '~/components/SubjectDot.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import Icon from '~/components/Icon.vue'
import { mapState, mapGetters } from 'vuex'
import { format } from 'date-fns'
export default {
  components: { Icon, SubjectDot, HeadingSub },
  props: {
    subject: {
      type: Object,
      default: null
    },
    room: {
      type: String,
      default: '—'
    },
    empty: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
    },
    start: Date,
    end: Date
  },
  computed: {
    ...mapState('subject',  ['placeholder']),
    ...mapGetters('homework', ['currentWeek']),
    backgroundColor() {
      if (this.empty) {
        return false
      } else {
        return this.subject.color
      }
    }
  },
  methods: {
    ...mapGetters(['textColor', 'formatTime'])
  }
}
</script>

<style lang="stylus" scoped>
.card-wrapper
  cursor pointer
.card
  padding 0 1.5em
  z-index: 10
  height: 65px
  width: 500px
  border-radius var(--border-radius)
  display flex
  align-items center
  transition all .25s ease
  border 2px solid var(--grey-light)
  border-color transparent
  &.current
    justify-content center
  &.empty
    color black
    background white
    border-color var(--grey-light)
.infos
  display flex
  align-items center
  width 100%
  .subject
    font-size 1.2rem
    display flex
    align-items center
    .subject-name
      margin-left: -1.2em
      transition margin 0.25s ease
    .subject-color
      width 0px
      height 0px
  .room-and-time
    font-size 1rem
    margin-left auto
.room
.room-and-time
  margin-left auto
  font-family var(--fonts-monospace)
.room-and-time
  display flex
  align-items center
  text-align right
  flex-direction column
.time
  display flex
  align-items center
@media (max-width 1000px)
  .card-wrapper
    width: 100%
    display flex
    justify-content flex-start
  .card
    width: 100%
    max-width 500px

// .card-wrapper.expanded
//   .card
//     background var(--white) !important
//     border 2px solid var(--grey-light)
//   .infos
//     height: 65px
//     color var(--black) !important
//     display flex
//     align-items center
//     width 100%
//     .subject
//       display flex
//       align-items center
//       .subject-color
//         height 1.2em
//         width: 1.2em
//       .subject-name
//         margin-left 0.3em
//   .homework
//     display flex
//     flex-direction column
</style>
