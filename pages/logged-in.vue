<template lang="pug">
.container
  OverlayLoadingLogo(animation="loop")
  h1 Connexion...
</template>

<script>
import { mapstore, mapGetters, mapMutations, mapActions } from 'vuex'
import flatten from 'lodash.flatten'
//---------------------------------------------------
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'

export default {
    
    layout: 'bare',
    components: {
      OverlayLoadingLogo
    },

    async fetch({app, store}) {
      await store.dispatch('loadAll')
    },

    computed: {
      ...mapGetters({
        requireInitialSetup: 'requireInitialSetup'
      })
    },

    async mounted() {
      this.$store.dispatch('nuxtServerInit')
      if (this.requireInitialSetup()) this.$router.push('/setup')
      else this.$router.push('/')
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.container
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
</style>
