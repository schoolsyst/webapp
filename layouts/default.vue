<template lang="pug">
  .app
    TheTopBar(@menu-click="drawerOpened = !drawerOpened")
    TheDrawer(@close="drawerOpened = false" :opened="drawerOpened")
    .side-by-side
      TheSideRail
      main
        nuxt
    TheFooter
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
    // fix weird nuxt bug where the exercises+test arrays are duped outside of the #__nuxt container
    document
      .querySelectorAll("body > *:not(#__nuxt)")
      .forEach((e) => e.remove())
    setInterval(() => {
      this.$store.now = toDate(Date.now())
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
  margin-left: 110px
#side-rail
  margin-top: 80px
  padding-left: 15px
.side-by-side
  display: flex
</style>
