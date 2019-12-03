<template lang="pug">
  .card-wrapper(@click="$emit('expanded')" @blur="$emit('closed')")
    .card(
      :style="{\
        backgroundColor, \
        color: backgroundColor \
          ? textColor(backgroundColor)() \
          : false\
        }"
      :class="{empty, expanded}"
    )
      template(v-if="subject")
        template(v-if="!expanded")
              span.subject {{ subject.name }}
              span.room {{ room }}
        template(v-else)
              span.subject {{ subject.name }}
              .room-and-time 
                .room {{ room }}
                br
                .time
                  | {{ formatTime()(start) }}
                  Icon trending_flat
                  | {{ formatTime()(end) }}
      template(v-else)
        slot
</template>

<script>
import Icon from '~/components/Icon.vue'
import { mapState, mapGetters } from 'vuex'
import { format } from 'date-fns'
export default {
  components: { Icon },
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
  &.current
    justify-content center
  &.empty
    color black
    background white
    border 2px solid var(--grey-light)
.subject
  font-size: 1.5em
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

.card-wrapper.expanded
  height auto
</style>
