<template lang="pug">
//-
  COMPONENT TREE
  Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

  ArrayButtonFlat
  MainGroup
    MainGroupLeft
    MainGroupRight

.container
  TheHeading #PAGE_HEADING#
  ArrayButtonFlat
  MainGroup
    MainGroupLeft
      HeadingSub
    MainGroupRight
      HeadingSub
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TheHeading from '~/components/TheHeading.vue'
import ArrayButtonFlat from '~/components/ArrayButtonFlat.vue'
import ButtonFlat from '~/components/ButtonFlat.vue'
import MainGroup from '~/components/MainGroup.vue'
import MainGroupLeft from '~/components/MainGroupLeft.vue'
import MainGroupRight from '~/components/MainGroupRight.vue'
import HeadingSub from '~/components/HeadingSub.vue'
#__IMPORTS#

export default {
    components: {
        TheHeading,
        ArrayButtonFlat,
        ButtonFlat,
        MainGroup,
        MainGroupLeft,
        MainGroupRight,
        HeadingSub,
#__REGISTERS#
    },

    async fetch({ store, params }) {
        let { data } = await axios.get('#API_RESOURCE#', { headers: {
            Authorization: `Bearer ${auth.token}`
        }})


    },


    data() {
        return {

        }
    },

    computed: {
      ...mapGetters([
        'auth/getToken'
      ])
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>
