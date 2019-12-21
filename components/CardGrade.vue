<template lang="pug">
  .card-wrapper
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
          template(v-if="weight != 1")
            .multiplication-sign(title="Coefficient")
              .bar.bar-1(:style="offsetSubjectColor")
              .bar.bar-2(:style="offsetSubjectColor")
            .value(title="Coefficient") {{ weight }}
</template>

<script>
import Icon from '~/components/Icon.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import VueContext from 'vue-context'
import 'vue-context/src/sass/vue-context.scss'
import { mapGetters } from 'vuex'

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
    weight: Number
  },
  methods: {
    ...mapGetters('grades', ['formatUnit']),
    ...mapGetters(['textColor'])
  },
  computed: {
    offsetSubjectColor() {
      return {
        backgroundColor: this.subject.color,
        opacity: (
          this.textColor()(this.subject.color) === 'black' 
            ? 0.75
            : 0.5
        )
      }
    }
  },
  mounted() {
    console.log(this.$props)
  }
}
</script>

<style lang="stylus" scoped>
.card
  padding 1.1em 1.2em
  border 1px solid var(--grey-light)
  border-radius var(--border-radius)
  transition all 0.25s ease
  cursor pointer
.card:not(.theme-is-dark):hover
  box-shadow var(--shadow-2)
  border-color transparent
.card-wrapper
  padding 3px
  max-width 30em
.header
  font-size 1.1rem
  display flex
  align-items center
  .subject
    margin-right 0.75em
    max-width 7.5em
  .menu
    margin-left auto
.grade
  display flex
  padding .5em 0
.slanted-fraction
  font-family var(--fonts-monospace-light)
  font-size 2rem
  display flex
  align-items center
  .denominator, .numerator
    font-size 0.9em
  .denominator
    margin-bottom: -0.5em
    margin-left: -0.4em
  .numerator
    margin-top: -0.5em
    margin-right: -0.4em
  .fraction-bar
    opacity: 0.25
    height: 2em
    width: 0.07em
    transform rotate(45deg)
    left 1em
    margin 0 0.5em
  .multiplication-sign
    opacity: 0.25
    display flex
    justify-content center
    align-items center
    margin 0 0.75em
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
