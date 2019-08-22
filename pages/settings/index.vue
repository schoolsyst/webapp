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
    <ArrayButtonFlat>
        <ButtonFlat @click="$router.push('/logout')" icon="power_off">
            <nuxt-link to="/logout">Déconnexion</nuxt-link>
        </ButtonFlat>
    </ArrayButtonFlat>
    <MainGroup>
        <MainGroupLeft>
            <HeadingSub>Réglages</HeadingSub>
            <dl>
                <div v-for="(setting, i) in settings" :key="i">
                    <dt>{{name}} [<code>{{key}}</code>]</dt>
                    <dd>{{value}}</dd>
                </div>
            </dl>
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

    async asyncData() {
        let settings
        try {
            const { data } = await this.$axios.get('/settings/')
            settings = data
        } catch(error) {
            settings = null
        }
        return {
            settings
        }
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>