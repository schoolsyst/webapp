<template>
<!-- COMPONENT TREE
Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

ArrayButtonFlat
MainGroup
    MainGroupLeft
    MainGroupRight
-->

<div class="container">
    <TheHeading>Réglages</TheHeading>
    <ArrayButtonFlat></ArrayButtonFlat>
    <MainGroup>
        <MainGroupLeft>
            <HeadingSub></HeadingSub>
        </MainGroupLeft>
        <MainGroupRight>
            <HeadingSub></HeadingSub>
        </MainGroupRight>
    </MainGroup>
</div>
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

export default {
    components: {
        TheHeading,
        ArrayButtonFlat,
        ButtonFlat,
        MainGroup,
        MainGroupLeft,
        MainGroupRight,
        HeadingSub,
    },

    data() {
        return {
            
        }
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>