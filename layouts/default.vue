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
  mounted() {
    // // fix weird nuxt bug where the exercises+test arrays are duped outside of the #__nuxt container
    // document
    //   .querySelectorAll("body > *:not(#__nuxt)")
    //   .forEach((e) => e.remove())
    setInterval(() => {
      this.$store.commit('UPDATE_TIME', toDate(Date.now()))
    }, 1000)
  },
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
</style>
