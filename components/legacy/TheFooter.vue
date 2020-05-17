<template lang="pug">
    <footer class="TheFooter">
        OverlayLoadingLogo(animate-when="scrolled-into-view")
        a(href="https://www.schoolsyst.com/").logotype-wrapper: LogoWordmark.logotype
        code.version
          span.channel {{ version.channel }}
          span(title="Incrémentée par l'ajout de fonctionnalités").feat {{ version.feature }}.
          span(title="Incrémentée lors de changements dans l'interface").ui {{ version.ui }}.
          span(title="Incrémentée quand des bugs sont réglés").bug {{ version.bug }}
        p.open-source
          | Projet open source, code disponible chez 
          a(href="//github.com/schoolsyst") GitHub
          br
          | Créé par 
          a(href="https://ewen.works") Ewen Le Bihan
        //- p.wakatime
        //-   img(title="API" src="https://wakatime.com/badge/github/schoolsyst/backend.svg")
        //-   span.plus-sign +
        //-   img(title="Application web" src="https://wakatime.com/badge/github/schoolsyst/frontend.svg")
    </footer>
</template>

<script>
import { mapState } from 'vuex'
import HeadingSub from '~/components/legacy/HeadingSub.vue'
import OverlayLoadingLogo from '~/components/legacy/OverlayLoadingLogo.vue'
import LogoWordmark from '~/components/legacy/LogoWordmark.vue'
export default {
  components: {
    HeadingSub,
    OverlayLoadingLogo,
    LogoWordmark,
  },
  computed: {
    ...mapState(['version']),
  },
}
</script>

<style lang="stylus" scoped>
.TheFooter
  margin-top 10rem
  min-height 500px
  width 100%
  height 50vh

  +mobile
    height 75vh

  position relative
  z-index 999
  display flex
  flex-direction column
  justify-content center
  align-items center
  background var(--blue)

.OverlayLoadingLogo
  width 25vw
  height 25vh
  //transform: scale(2)

.OverlayLoadingLogo /deep/ svg *
  stroke white

.logotype
  //---   margins   ---
  margin-bottom 30px
  max-width 500px
  //--- positioning ---

  //--- dimensions  ---
  width 80%
  //---  appearance ---
  stroke #ffffff

.logotype-wrapper
  display flex
  justify-content center
  align-items center
  margin-top -30px
  height 100px

.version
  //---   margins   ---

  //---  appearance ---
  color #ffffff
  //--- positioning ---
  //--- dimensions  ---
  font-size 15px
  //---  animation  ---

.version .channel
  margin-right 1em
  padding 0.5em
  border 2px solid white
  border-radius var(--border-radius)
  text-transform uppercase

.open-source
  margin-top 2em
  color white
  text-align center

  a
    border-color white
    color white

.wakatime
  display flex
  align-items center
  margin-top 0.5em

  .plus-sign
    padding 0 0.2em
    color white
    font-size 2em
</style>
