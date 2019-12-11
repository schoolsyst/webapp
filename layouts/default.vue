<template lang="pug">
  .app
    TheTopBar(@menu-click="drawerOpened = !drawerOpened")
    TheDrawer(@close="drawerOpened = false" :opened="drawerOpened")
    .side-by-side
      TheSideRail
      main
        nuxt
</template>

<script>
import TheDrawer from '~/components/TheDrawer.vue'
import TheTopBar from "~/components/TheTopBar.vue"
import TheFooter from "~/components/TheFooter.vue"
import TheSideRail from '~/components/TheSideRail.vue'
import { toDate } from 'date-fns'
import { mapGetters, mapState } from 'vuex'

export default {
  components: {
    TheFooter,
    TheDrawer,
    TheTopBar,
    TheSideRail
  },
  data() {
    return {
      drawerOpened: false
    }
  },
  computed: {
    ...mapState(['now']),
  },
  methods: {
    ...mapGetters('theme', {theme: 'current'})
  },
  async mounted() {
    // Refresh time every second
    setInterval(() => {
      this.$store.commit('UPDATE_TIME', toDate(Date.now()))
    }, 1 * 1000)
  },
  async onBeforeRouteLeave() {
    console.log('Refreshing theme')
    await this.$store.dispatch('theme/set')
  }
}
</script>

<style scoped lang="sass">
@import '~/assets/defaults'

// Keep footer outta the first page
.TheNavbar + div
  min-height: 100vh
  
main
  margin-top: 100px
  +desktop
    margin-left: 110px
  +mobile
    margin-left: 20px
    margin-right: 20px
main, .container
  width: 100%
  height: 100%
#side-rail
  margin-top: 80px
  padding-left: 15px
  +mobile
    display: none
.side-by-side
  display: flex
#page, 
/deep/ #empty-state,
/deep/ #loading-state
  min-height: calc(100vh - 100px) // top bar height
</style>
