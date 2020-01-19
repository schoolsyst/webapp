<template lang="pug">
.container
  OverlayLoadingLogo(animation="loop")
  h1 À plus!
  p Déconnexion en cours...
</template>

<script>
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'
export default {
  layout: 'bare',
  components: { OverlayLoadingLogo },
  async mounted() {
    // Clear vuex data
    await this.$store.dispatch('clearAllData')
    // Logout
    this.$auth.logout()
  }
}
</script>

<style lang="stylus" scoped>
.container
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column

  p
    margin-top: 10px
    opacity: 0.25
</style>
