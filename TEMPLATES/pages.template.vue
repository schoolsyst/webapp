<template lang="pug">
.container
  TheHeading #PAGE_HEADING#
  MainGroup
    MainGroupLeft
    MainGroupRight
</template>

<script>
//--- essentials ---
import axios from 'axios'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
//--- components ---
import TheHeading from '~/components/TheHeading.vue'
import ArrayButtonFlat from '~/components/ArrayButtonFlat.vue'
import ButtonFlat from '~/components/ButtonFlat.vue'
import MainGroup from '~/components/MainGroup.vue'
import MainGroupLeft from '~/components/MainGroupLeft.vue'
import MainGroupRight from '~/components/MainGroupRight.vue'
import HeadingSub from '~/components/HeadingSub.vue'
#__IMPORTS#

export default {
    #MIDDLEWARE_DECLARATION#
    #LAYOUT_DECLARATION#
    components: {
        TheHeading,
        MainGroup,
        MainGroupLeft,
        MainGroupRight,
        HeadingSub,
#__REGISTERS#
    },

    data() {
        return {

        }
    },

    computed: {
      ...mapGetters({
        #GETTERS_MAPPING#
      })
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>
