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
      button.fold-unfold
        Icon keyboard_arrow_down
    transition(name="reports")
      ul(:class="{ folded: foldResolved }").reports-list
        li(
          v-for="report in [...resolved].reverse()"
          :key="report.uuid"
        )
          CardReport(v-bind="report")
    //TODO: list reports, redir to new/ if no reports
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonNormal from '~/components/ButtonNormal.vue'
import CardReport from '~/components/CardReport.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import Icon from '~/components/Icon.vue'

export default {
  components: { ButtonNormal, CardReport, HeadingSub, Icon },
  data() {
    return {
      foldResolved: true
    }
  },
  computed: {
    ...mapGetters('reports', ['all', 'resolved', 'unresolved'])
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('reports/load')
    })
  },
  methods: {
    toggleFoldResolved() {
      this.foldResolved = !this.foldResolved
    }
  }
}
</script>

<style lang="stylus" scoped>

//
// Definitions
//

//
// Layout
//

.container
  display flex
  align-items center
  flex-direction column
  text-align center
.new-report
  margin-bottom 2em
  max-width 20em
  margin 0 auto
.reports-list
  max-width 100%
.reports-list li
  display flex
  justify-content center
.reports-list li:not(:last-child)
  margin-bottom 1em
.HeadingSub
  margin: 0 auto
  margin-bottom .5em
  margin-top: 1.5em
  max-width calc(100% - 2em) //ref: <CardReport>
  width 50rem //ref: <CardReport>
.fold-unfold
  margin-left auto
.fold-unfold /deep/ i
  font-size: 2em

//
// Colors
//

.HeadingSub .count
  color var(--grey-light)
  margin-left: 0.5em

//
// Reactions
//

.HeadingSub
  cursor pointer
.fold-unfold /deep/ i
  transition transform .125s ease
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
