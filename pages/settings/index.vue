<template lang="pug">
//- COMPONENT TREE
    Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

    ArrayButtonFlat
    MainGroup
        MainGroupLeft
        MainGroupRight

.container
    ModalAddSubject(:subject="newSubject" no-edit-button)

    TheHeading Réglages
    ArrayButtonFlat
        ButtonFlat(@click="$router.push('/logout')" icon="power_settings_new")
            nuxt-link(to="/logout") Déconnexion
        ButtonFlat(icon="build")
            nuxt-link(to="/setup") Configuration initiale
    MainGroup
        MainGroupLeft
            template(v-for="(settings, namespace) in groupedSettings")
                template(v-if="!namespace.startsWith('__')")
                    HeadingSub {{namespace}}
                    .field(v-for="setting in settings")
                        label(:for="`field_${setting.key.replace('_', '-')}`") {{setting.name}}
                        template(v-if="setting.kind === 'choices'")
                            select(:id="`field_${setting.key.replace('_', '-')}`")
                                option(v-for="choice in setting.choices.split(',')" :selected="choice === setting.default") {{choice}}
                        template(v-else)
                            textarea(:id="`field_${setting.key.replace('_', '-')}`") {{getSetting(setting.key)}}
        MainGroupRight
            HeadingSub Matières
            ArrayCardSubject
                li: ButtonLargeFlat(icon="plus", open-modal="add-subject", open-at="self") Ajouter une {{ subjects.length ? 'autre' : 'matière'}}
                li(v-for="subject in subjects" :key="subject.uuid"): CardSubject(v-bind="subject")

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
import CardSubject from '~/components/CardSubject.vue'
import ModalAddSubject from '~/components/ModalAddSubject.vue'
import ButtonLargeFlat from '~/components/ButtonLargeFlat.vue'
import ArrayCardSubject from '~/components/ArrayCardSubject.vue'


export default {
    components: {
        TheHeading,
        ArrayButtonFlat,
        ButtonFlat,
        MainGroup,
        MainGroupLeft,
        MainGroupRight,
        HeadingSub,
        ModalAddSubject,
        CardSubject,
        ButtonLargeFlat,
        ArrayCardSubject,
    },
    head() {
        return {
            title: `${this.fmtExercisesDueCount}Réglages`
        };
    },
    computed: {
        ...mapGetters({
            defaultSettings: 'defaultSettings',
            setting: 'setting',
            subjects: 'subjects',
            pendingExercises: "homework/pendingExercises"
        }),
        fmtExercisesDueCount() {
            if (this.pendingExercises.length)
                return `(${this.pendingExercises.length}) `;
            return "";
        },  
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

<style lang="sass" scoped>
@import '~/assets/defaults'

.field
    display: flex
    +mobile
        flex-direction: column
    align-items: center
    margin-bottom: 20px
    label
        width: 300px
    textarea
        padding: 10px
        background: var(--grey)
        border-radius: 7.5px
</style>