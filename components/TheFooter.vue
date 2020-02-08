<template lang="pug">
    <footer class="TheFooter">
        OverlayLoadingLogo(animate-when="scrolled-into-view")
        .logotype-wrapper: Logotype.logotype
        code.version
          span.channel {{ version.channel }}
          span(title="Incrémentée par l'ajout de fonctionnalités").feat {{ version.feature }}.
          span(title="Incrémentée lors de changements dans l'interface").ui {{ version.ui }}.
          span(title="Incrémentée quand des bugs sont réglés").bug {{ version.bug }}
        p.open-source
          | Projet open source, code disponible chez 
          a(href="//github.com/schoolsyst") GitHub
        p.wakatime
          img(title="API" src="https://wakatime.com/badge/github/schoolsyst/backend.svg")
          span.plus-sign +
          img(title="Application web" src="https://wakatime.com/badge/github/schoolsyst/frontend.svg")
    </footer>
</template>

<script>
import { mapState } from 'vuex'
import HeadingSub from '~/components/HeadingSub.vue'
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'
import Logotype from '~/components/Logotype.vue'
export default {
  components: {
    HeadingSub,
    OverlayLoadingLogo,
    Logotype
  },
  computed: {
    ...mapState(['version'])
  }
}
</script>

<style lang="stylus" scoped>
.TheFooter
  margin-top: 10rem
  width: 100%
  min-height: 500px
  height: 50vh

  +mobile
    height: 75vh

  background: var(--blue)
  position: relative
  z-index: 999
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column

.OverlayLoadingLogo
  height: 25vh
  width: 25vw
  // transform: scale(2)

.OverlayLoadingLogo /deep/ svg *
  stroke: white

.logotype
  // --- positioning ---

  // --- dimensions  ---
  width: 80%
  max-width: 500px
  // ---   margins   ---
  margin-bottom: 30px
  // ---  appearance ---
  stroke: #ffffff
.logotype-wrapper
  height: 100px
  display flex
  justify-content center
  align-items center
  margin-top: -30px

.version
  // --- positioning ---
  // --- dimensions  ---
  font-size: 15px
  // ---   margins   ---

  // ---  appearance ---
  color: #ffffff
  // ---  animation  ---
.version .channel
  margin-right 1em
  padding 0.5em
  text-transform uppercase
  border 2px solid white
  border-radius var(--border-radius)

.open-source
  margin-top 2em
  text-align center
  color white
  a
    color white
    border-color white
.wakatime
  margin-top: 0.5em
  display flex
  align-items center
  .plus-sign
    color white
    padding 0 .2em
    font-size: 2em
</style>
