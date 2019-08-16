<template lang="pug">
//-
  COMPONENT TREE
  Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

  ArrayButtonFlat
  MainGroup
    MainGroupLeft
    MainGroupRight

.container
  TheHeading Déconnexion...
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TheHeading from '~/components/TheHeading.vue'


export default {
    components: {
        TheHeading,

    },

    data() {
        return {

        }
    },

    mounted() {
        this.$store.commit('SET_LOGGED_IN', false)
        this.$router.push('/')
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>
