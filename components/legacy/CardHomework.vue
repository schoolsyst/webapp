<template lang="pug">
    .card(
        @click="$emit('click')"
        :class="{completed, opened, [`is-a-${type.toLowerCase()}`]: true}"
        v-touch:swipe.left="toggleComplete"
        v-touch:swipe.right="toggleComplete"
    )
        .complete-slider(@click.stop="toggleComplete" :title="sliderTooltip")
            Icon(v-show="completed") refresh
            Icon(v-show="!completed") check
        .infos
            .first-line
                .strikethrough-line
                BadgeSubject.subject-color(v-bind="subject" variant="dot")
                span.name {{ name }}
                Icon.graded-indicator(
                  v-if="['COURSEWORK', 'TEST'].includes(type)"
                  v-tooltip="type === 'TEST' ? 'Contrôle' : 'Noté'"
                ) error_outline
            .details(v-if="details" v-html="details")
</template>

<script>
import { mapActions } from 'vuex'
import debounce from 'lodash.debounce'
import Icon from '~/components/legacy/Icon.vue'
import BadgeSubject from '~/components/legacy/BadgeSubject.vue'
import InputField from '~/components/legacy/InputField.vue'
export default {
  components: { Icon, BadgeSubject, InputField },
  props: {
    name: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    subject: {
      type: Object,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    opened: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    completed() {
      return this.progress >= 1
    },
    sliderTooltip() {
      return `Marquer comme ${this.completed ? 'non-' : ''}terminé`
    },
  },
  methods: {
    ...mapActions('homework', ['switchCompletion']),
    toggleComplete: debounce(
      async function() {
        this.$emit('completion-switch', !this.completed)
        await this.switchCompletion({ uuid: this.uuid })
      },
      500,
      { leading: true, trailing: false }
    ),
  },
}
</script>

<style lang="stylus" scoped>
.card
  display flex
  overflow hidden
  max-width 100%
  //height: 100px
  width 500px
  border-radius var(--border-radius)
  cursor pointer
  transition box-shadow 0.25s ease

.strikethrough-line
  position absolute
  top 50%
  left calc(((100% - (100% - (var(--strikethrough-line-offset) * 2))) / 2))
  width 0
  height 0.1em
  background var(--black)
  transition width 0.25s ease
  --strikethrough-line-offset 0

.card.completed .complete-slider
  background-color var(--blue)

.card:not(.completed) .complete-slider
  background-color var(--green)

.complete-slider
  z-index 10
  display flex
  flex-shrink 0
  align-items center
  overflow hidden
  width 0
  border-radius var(--border-radius)
  border-top-right-radius 0
  border-bottom-right-radius 0
  color var(--white)
  transition width 0.25s ease

  i
    margin-left 0.5em

.infos
  position relative
  display flex
  flex-direction column
  padding 1.1em 1.2em
  width 100%
  border 1px solid var(--grey-light)
  border-radius var(--border-radius)

  .first-line
    position relative
    display flex
    align-items center
    overflow hidden
    width 100%
    text-overflow ellipsis
    white-space nowrap

  .name
    margin-left 0.5rem

  .details
    flex-grow 0
    overflow hidden
    margin-top 0.5em
    width 100%
    text-overflow ellipsis
    white-space pre-wrap
    font-size 0.75em

  .graded-indicator
    margin-left auto
    font-size 1.3em

.is-a-test .graded-indicator
  color var(--red)

.card.completed
  .infos
    opacity 0.5

  .strikethrough-line
    width calc(100% - (var(--strikethrough-line-offset) * 2))

.card:hover
  &
    box-shadow var(--shadow-2)

  .complete-slider
    width 3em

  &.completed .complete-slider:hover
    background-color var(--blue-dark)

  &:not(.completed) .complete-slider:hover
    background-color var(--green-light)

  .infos
    border-left 0
    border-top-left-radius 0
    border-bottom-left-radius 0
</style>
