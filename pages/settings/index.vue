<template lang="pug">
    //TODO: move ul.categories > li to <InputSetting>, to reuse in setup
    //TODO: center-align, less width, index=portal to one page per category + subjects page + schedule page
    .container
        .-side-by-side
            ul.categories
                li(v-for="g in grouped")
                    HeadingSub {{ g[0] }}
                    ul.settings
                        li(v-for="setting in g[1]" :key="setting.uuid")
                            InputSetting(v-bind="{...setting, _key: setting.key}")
            ul.subjects
                li(v-for="subject in subjects")
                    CardSubject(v-bind="subject")

</template>

<script>
import HeadingSub from '~/components/HeadingSub.vue'
import InputField from '~/components/InputField.vue'
import CardSubject from '~/components/CardSubject.vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import Checkbox from '~/components/Checkbox.vue'
import InputSetting from '~/components/InputSetting.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
    components: { HeadingSub, InputField, CardSubject, Multiselect, Checkbox, InputSetting },
    computed: {
        ...mapGetters('settings', ['grouped', 'all']),
        ...mapGetters('subjects', { subjects: 'all' })
    },
    async mounted() {
        this.$withLoadingScreen(async () => {
            await this.$store.dispatch('settings/load')
            await this.$store.dispatch('subjects/load')
        })
    }
}
</script>

<style lang="stylus" scoped>
ul.categories li
    display flex
    flex-direction column
    justify-content center
    margin-bottom 1em
    p.description
        margin-bottom: 0.5em
        margin-top: 0.5em
        font-size: 0.9em
        text-align center
        font-style italic
h2
    margin-bottom: 0.5em
</style>
