<template lang="pug">
  .container
    ButtonNormal(variant="primary" @click="$modal.open('add-report')").new-report Nouveau rapport
    
    HeadingSub 
      | En cours de résolution
      span.count {{ unresolved.length }}
    transition-group(name="reports-list" tag="ul").reports-list
      li(
        v-for="report in [...unresolved].reverse()"
        :key="report.uuid"
      )
        CardReport(v-bind="report")
    HeadingSub(:class="{ folded: foldResolved }" @click="toggleFoldResolved")
      | Résolus
      span.count {{ resolved.length }}
      button.fold-unfold(v-if="resolved.length")
        Icon keyboard_arrow_down
    transition(name="reports")
      ul(:class="{ folded: foldResolved }").reports-list
        li(
          v-for="report in [...resolved].reverse()"
          :key="report.uuid"
        )
          CardReport(v-bind="report")
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonNormal from '~/components/legacy/ButtonNormal.vue'
import CardReport from '~/components/legacy/CardReport.vue'
import HeadingSub from '~/components/legacy/HeadingSub.vue'
import Icon from '~/components/legacy/Icon.vue'

export default {
  components: { ButtonNormal, CardReport, HeadingSub, Icon },
  data() {
    return {
      foldResolved: true,
    }
  },
  computed: {
    ...mapGetters('reports', ['all', 'resolved', 'unresolved']),
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('reports/load')
    })
  },
  methods: {
    toggleFoldResolved() {
      this.foldResolved = !this.foldResolved
    },
  },
}
</script>

<style lang="stylus" scoped>
//
//Definitions
//

//
//Layout
//
.container
  display flex
  flex-direction column
  align-items center
  text-align center

.new-report
  margin 0 auto
  margin-bottom 2em
  max-width 20em

.reports-list
  max-width 100%

.reports-list li
  display flex
  justify-content center

.reports-list li:not(:last-child)
  margin-bottom 1em

.HeadingSub
  display flex
  align-items center
  margin 0 auto
  margin-top 1.5em
  margin-bottom 0.5em
  max-width calc(100% - 2em) //ref: <CardReport>
  width 50rem //ref: <CardReport>

.fold-unfold
  margin-left auto

.fold-unfold /deep/ i
  font-size 2em

//
//Colors
//
.HeadingSub .count
  margin-left 0.5em
  color var(--grey-light)

//
//Reactions
//
.HeadingSub
  cursor pointer

.fold-unfold /deep/ i
  transition transform 0.125s ease

.HeadingSub:not(.folded) .fold-unfold /deep/ i
  transform rotate(180deg)
  transform-origin center

.reports-list
  transition opacity 0.125s ease

  &.folded
    opacity 0

  &:not(.folded)
    opacity 1

.reports-enter, .reports-leave-to
  opacity 1
</style>
