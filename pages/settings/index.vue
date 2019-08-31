<template lang="pug">
//- COMPONENT TREE
    Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

    ArrayButtonFlat
    MainGroup
        MainGroupLeft
        MainGroupRight

.container
    TheHeading Réglages
    ArrayButtonFlat
        ButtonFlat(@click="$router.push('/logout')" icon="power_off")
            nuxt-link(to="/logout") Déconnexion
    MainGroup
        MainGroupLeft
            template(v-for="(settings, namespace) in groupedSettings")
                template(v-if="!namespace.startsWith('__')")
                    HeadingSub {{namespace}}
                    .field(v-for="setting in settings")
                        label(:for="`field_${setting.key.replace('_', '-')}`") {{setting.name}}
                        textarea(:id="`field_${setting.key.replace('_', '-')}`") {{getSetting(setting.key)}}

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import groupBy from 'lodash.groupby'
//-----------------------------------------------------------------
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
    computed: {
        ...mapGetters({
            defaultSettings: 'defaultSettings',
            setting: 'setting'
        }),
        groupedSettings() {
            return groupBy(this.defaultSettings, 'namespace')
        },
    },
    methods: {
        getSetting(key) {
            try {
                return this.setting(key).value
            } catch(error) {
                console.warn(`Cannot find setting ${key}`)
                return null
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
.field
    display flex
    align-items center
    margin-bottom 20px
    label
        width 300px
    textarea
        padding 10px
        background var(--grey)
        border-radius 7.5px
</style>