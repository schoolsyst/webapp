<template lang="pug">
.container
  OverlayLoadingLogo(animation="loop")
  h1 Connexion...
</template>

<script>
//--- essentials ---
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
//--- components ---
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'

export default {
    
    layout: 'bare',
    components: {
      OverlayLoadingLogo
    },

    data() {
        return {

        }
    },

    computed: {
      ...mapGetters({
        requireInitialSetup: 'requireInitialSetup'
      })
    },

    mounted() {
      if (this.requireInitialSetup) this.$router.push('/setup')
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
