<template lang="pug">
  .card-wrapper(@click="$emit('click')")
    .card
      .header
        BadgeSubject(v-bind="subject" thin)
        span.name {{ name }}
        button.menu(@click="$emit('edit')"): Icon(filled) more_vert
      .grade
        .slanted-fraction
          .numerator {{ formatUnit()(obtained, unit) }}
          .fraction-bar(:style="offsetSubjectColor")
          .denominator {{ unit }}
          template(v-if="weight !== 1")
            .multiplication-sign(title="Coefficient")
              .bar.bar-1(:style="offsetSubjectColor")
              .bar.bar-2(:style="offsetSubjectColor")
            .value(title="Coefficient") {{ weight }}
</template>

<script>
import 'vue-context/src/sass/vue-context.scss'
import VueContext from 'vue-context'
import { mapGetters } from 'vuex'
import Icon from '~/components/Icon.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'

export default {
  components: { BadgeSubject, Icon, VueContext },
  props: {
    uuid: String,
    subject: Object,
    obtained: Number,
    expected: Number,
    added: Date,
    obtained_date: Date,
    goal: Number,
    name: String,
    unit: Number,
    weight: Number,
  },
  methods: {
    ...mapGetters('grades', ['formatUnit']),
    ...mapGetters(['textColor']),
  },
  computed: {
    offsetSubjectColor() {
      return {
        backgroundColor: this.subject.color,
        opacity: this.textColor()(this.subject.color) === 'black' ? 0.75 : 0.5,
      }
    },
  },
  mounted() {
    console.log(this.$props)
  },
}
</script>

<style lang="stylus" scoped>
.card
  padding 1.1em 1.2em
  border 1px solid var(--grey-light)
  border-radius var(--border-radius)
  cursor pointer
  transition all 0.25s ease

.card:not(.theme-is-dark):hover
  border-color transparent
  box-shadow var(--shadow-2)

.card-wrapper
  padding 3px

.header
  display flex
  align-items center
  font-size 1.1rem

  .subject
    margin-right 0.75em
    max-width 7.5em

  .menu
    margin-left auto

.grade
  display flex
  padding 0.5em 0

.slanted-fraction
  display flex
  align-items center
  font-size 2rem
  font-family var(--fonts-monospace-light)

  .denominator, .numerator
    font-size 0.9em

  .denominator
    margin-bottom -0.5em
    margin-left -0.4em

  .numerator
    margin-top -0.5em
    margin-right -0.4em

  .fraction-bar
    left 1em
    margin 0 0.5em
    width 0.07em
    height 2em
    opacity 0.25
    transform rotate(45deg)

  .multiplication-sign
    display flex
    justify-content center
    align-items center
    margin 0 0.75em
    opacity 0.25

    .bar
      position relative
      width 0.07em
      height 0.75em

      &.bar-1
        position absolute
        transform rotate(45deg)

      &.bar-2
        position absolute
        transform rotate(-45deg)
</style>
