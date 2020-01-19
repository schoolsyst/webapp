<template lang="pug">
  .app
    TheTopBar(@menu-click="drawerOpened = !drawerOpened")
    TheDrawer(@close="drawerOpened = false" :opened="drawerOpened")
    .side-by-side
      aside.left
        TheSideRail
      main.right
        nuxt#page
        #loading-screen
          OverlayLoadingLogo(animation="loop")
          h1.title Chargement...
          p.subtitle 
</template>

<script>
import { toDate } from 'date-fns'
import { mapGetters, mapState } from 'vuex'
import TheDrawer from '~/components/TheDrawer.vue'
import TheTopBar from '~/components/TheTopBar.vue'
import TheFooter from '~/components/TheFooter.vue'
import TheSideRail from '~/components/TheSideRail.vue'
import BaseModal from '~/components/BaseModal.vue'
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'

export default {
  components: {
    TheFooter,
    TheDrawer,
    TheTopBar,
    TheSideRail,
    BaseModal,
    OverlayLoadingLogo
  },
  data() {
    return {
      drawerOpened: false
    }
  },
  computed: {
    ...mapState(['now'])
  },
  async mounted() {
    await this.$store.dispatch('theme/set')
    // Refresh time every second
    setInterval(() => {
      this.$store.commit('UPDATE_TIME', toDate(Date.now()))
    }, 1 * 1000)
  },
  methods: {
    ...mapGetters('theme', { theme: 'current' })
  }
}
</script>

<style scoped lang="stylus">
// Keep footer outta the first page
.TheNavbar + div
  min-height: 100vh

main
  margin-top: 100px

  @media (min-width: 650px)
    margin-left: 110px

  @media (max-width: 650px)
    margin-left: 20px
    margin-right: 20px

main, .container
  width: 100%
  height: 100%

#side-rail
  margin-top: 80px
  padding-left: 15px

  @media (max-width: 650px)
    display: none

.side-by-side
  display: flex

#page, /deep/ #empty-state, /deep/ #loading-screen
  min-height: calc(100vh - 100px) // top bar height

@media (max-width: 600px)
  main
    margin-left: 0
    margin-right: 0

    & /deep/ h2
      margin-left: 20px
      margin-right: 20px
</style>
