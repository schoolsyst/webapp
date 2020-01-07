<template lang="pug">
    //TODO: move ul.categories > li to <InputSetting>, to reuse in setup
    //TODO: center-align, less width, index=portal to one page per category + subjects page + schedule page
    .container
        ModalAddSubject(v-model="newSubject")
        .-side-by-side
            ul.categories
                li(v-for="g in grouped")
                    HeadingSub {{ g[0] }}
                    ul.settings
                        li(v-for="setting in g[1]" :key="setting.uuid")
                            InputSetting.input(v-bind="{...setting, _key: setting.key}")
            .subjects-wrapper
                HeadingSub Matières
                ul.subjects
                    li.new(@click="$modal.show('add-subject')")
                        Icon add
                    li(v-for="subject in subjects")
                        CardSubject(v-bind="subject")

</template>

<script>
import HeadingSub from '~/components/HeadingSub.vue'
import CardSubject from '~/components/CardSubject.vue'
import InputSetting from '~/components/InputSetting.vue'
import Icon from '~/components/Icon.vue'
import InputField from '~/components/InputField.vue'
import ModalAddSubject from '~/components/ModalAddSubject.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
    components: { HeadingSub, InputField, CardSubject, InputSetting, Icon, ModalAddSubject },
    data() {
        return {
            newSubject: {
                name: "",
                color: "#000000",
                weight: 1
            }
        }
    },
    computed: {
        ...mapGetters('settings', ['grouped', 'all']),
        ...mapGetters('subjects', { subjects: 'all', sortSubjects: 'orderBy' })
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
    margin-bottom 1.5rem
    p.description
        margin-bottom: 0.5em
        margin-top: 0.5em
        font-size: 0.9em
        text-align center
        font-style italic
h2
    margin-bottom: 0.5em

ul.subjects li
    margin-bottom 1em
    &.new
        background var(--blue-offset)
        color var(--blue)
        border-radius var(--border-radius)
        display flex
        justify-content center
        align-items center
        width 100%
        max-width 450px
        height: 100px
        cursor pointer
        & /deep/ i
            font-size: 3rem
        &:hover
            background var(--blue-offset-dark)
            color var(--blue-dark)
</style>
