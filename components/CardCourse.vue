<template lang="pug">
  .card-wrapper(
    @click="$emit('click'); $emit(expanded ? 'close' : 'expand')"
    :class="{empty, expanded}"
  )
    .card(
      :style="cardStyles"
      :class="{empty, expanded}"
    )
      template(v-if="subject")
        .infos
          span.subject
            span.subject-name {{ subject.name }}
          .room-and-time 
            .room {{ room }}
      template(v-else)
        slot
</template>

<script>
import { mapGetters } from 'vuex'
import BadgeSubject from '~/components/BadgeSubject.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import Icon from '~/components/Icon.vue'

export default {
  components: { Icon, BadgeSubject, HeadingSub },
  props: {
    subject: {
      type: Object,
      required: true,
    },
    room: {
      type: String,
      default: '—',
    },
    empty: {
      type: Boolean,
      default: false,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    start: {
      type: Date,
      default: null,
    },
    end: {
      type: Date,
      default: null,
    },
  },
  computed: {
    backgroundColor() {
      return this.subject.color
    },
    cardStyles() {
      if (this.empty) {
        return false
      }
      return {
        backgroundColor: this.backgroundColor,
        color: this.textColor()(this.backgroundColor),
      }
    },
  },
  methods: {
    ...mapGetters(['textColor']),
  },
}
</script>

<style lang="stylus" scoped>
.card-wrapper
  cursor pointer

.card
  z-index 10
  display flex
  align-items center
  padding 0 1.5em
  width 500px
  height 65px
  border 2px solid var(--grey-light)
  border-color transparent
  border-radius var(--border-radius)
  transition all 0.25s ease

  &.current
    justify-content center

  &.empty
    border-color var(--grey-light)
    background var(--white)
    color var(--black)

.infos
  display flex
  align-items center
  width 100%

  .subject
    display flex
    align-items center
    font-size 1.2rem

    .subject-name
      transition margin 0.25s ease

    .subject-color
      width 0
      height 0

  .room-and-time
    margin-left auto
    font-size 1rem

.room, .room-and-time
  margin-left auto
  font-family var(--fonts-monospace)

.room-and-time
  display flex
  flex-direction column
  align-items center
  text-align right

.time
  display flex
  align-items center

@media (max-width: 888px)
  .card-wrapper
    display flex
    justify-content flex-start
    width 100%

  .card
    max-width 500px
    width 100%
</style>
