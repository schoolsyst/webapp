<template lang="pug">
    .container
        ModalAddHomework(@click="post({homework: $event})")
        template(v-if="grouped.length")
            ButtonNormal.new(@click="$modal.show('add-homework')") Ajouter
            Checkbox(v-model="showCompleted") Voir les devoirs terminés
            ul.homework-groups
                li.group(v-for="group in grouped")
                    HeadingSub 
                        span.due.late(v-if="group.due === 'LATE'") En retard
                        span.due(v-else) {{ relativeDate(group.due) }}
                        button(
                            v-if="group.homeworks.filter(o => o.progress < 1).length"
                            v-tooltip="'Tout marquer comme terminé'"
                            @click="markAllAsDone(group.homeworks)"
                        ): Icon done_all
                    ul.homework
                        li(v-for="hw in group.homeworks", :key="hw.uuid")
                            CardHomework(v-bind="hw")
        ScreenEmpty.empty(v-else @cta="$modal.show('add-homework')")
            template(#smiley) \o/
            p
                | Bravo. Vous n'avez plus rien à travailler, pour le moment.
                Checkbox(v-model="showCompleted") Voir les devoirs terminés
            template(#cta) Ajouter des devoirs
        vue-context(
            ref="menu" 
            :close-on-click="true" 
            :close-on-scroll="true"
        )
            template(slot-scope="child" v-if="child.data")
                li: a(@click="child.data.hw.completed") #[Icon ]
                li: a(@click="del(child.data.hw.uuid)") #[Icon delete] supprimer
</template>

<script>
import CardHomework from '~/components/CardHomework.vue'
import ScreenEmpty from '~/components/ScreenEmpty.vue'
import ModalAddHomework from '~/components/ModalAddHomework.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import Checkbox from '~/components/Checkbox.vue'
import VueContext from 'vue-context'
import Icon from '~/components/Icon.vue'
import 'vue-context/src/sass/vue-context.scss'
import { mapGetters, mapActions, mapState } from 'vuex';
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
export default {
    components: { CardHomework, ScreenEmpty, ModalAddHomework, ButtonNormal, VueContext, HeadingSub, Icon, Checkbox },
    head: {
        title: 'Devoirs'
    },
    computed: {
        ...mapGetters('homework', ['grouped']),
        ...mapState(['now']),
        showCompleted: {
            set(value) { this.setSetting({key: 'show_completed_exercises', value}) },
            get() { this.getSetting('show_completed_exercises') }
        }
    },
    methods: {
        ...mapGetters('homework', ['group']),
        ...mapActions('homework', ['post', 'patch']),
        ...mapActions({ setSetting: 'settings/setValue' }),
        ...mapGetters({ getSetting: 'settings/value' }),
        relativeDate(date) {
            return formatDistance(date, this.now, { locale: fr, addSuffix: true })
        },
        async markAllAsDone(homeworks) {
            for (const hw of homeworks) {
                await this.patch({ uuid: hw.uuid, modifications: { progress: 1 }, force: true })
            }
        }
    },
    async mounted() {
        this.$withLoadingScreen(async () => {
            await this.$store.dispatch('settings/load')
            await this.$store.dispatch('schedule/load')
            await this.$store.dispatch('homework/load')
        }, { title: "Feuilletage de l'agenda" })
    }
}
</script>

<style lang="stylus" scoped>
ul.homework li
.new
.Checkbox
    margin-bottom 2em
    justify-content center
    display flex

h2
    justify-content center
    display flex
    align-items center
    margin-bottom: 0.75em
    margin-top 3em
    button
        margin-left 1em
    .late, .late button
        color var(--red)
h2:not(:hover) button
    opacity: 0
h2 button:hover
    color var(--blue)
.empty /deep/ .Checkbox
    margin-top: 0.5em
    font-size: 0.8em
    justify-content center
</style>
