<template lang="pug">
  <div class="app">
    #loading-screen
      OverlayLoadingLogo(animation="loop")
      h1.title Chargement...
      p.subtitle 
    nuxt#page
  </div>
</template>

<script>
import { toDate } from 'date-fns'
import OverlayLoadingLogo from '~/components/legacy/OverlayLoadingLogo.vue'
export default {
  components: { OverlayLoadingLogo },
  head() {
    return {
      bodyAttrs: {
        class: 'layoutBare',
      },
    }
  },
  async mounted() {
    await this.$store.dispatch('theme/set')
    // Refresh time every second
    setInterval(() => {
      this.$store.commit('UPDATE_TIME', toDate(Date.now()))
    }, 1 * 1000)
  },
}
</script>

<style scoped lang="sass">
@import '~/assets/defaults'

.container
  min-height: 100vh
  min-width: 100vw
  padding: 20px

  +mobile
  .container
    padding: 10px
</style>

<style lang="sass">
//WARNING: _NOT_ SCOPED!
body.layoutBare
  overflow-x: hidden
</style>
