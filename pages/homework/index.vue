<template lang="pug">
    //TODO@ROADMAP: drag homework cards to change due date
    .container
        ModalAddHomework(@click="post({homework: $event})")
        .grades-wrapper(v-if="grouped.filter(g => _needToShowGroup()({...g, showCompleted})).length")
            Checkbox(v-model="showCompleted") Voir les devoirs terminés
            ul.homework-groups
                li.group.add-new
                    ul.homework
                        li
                            .card.new(@click="$modal.show('add-homework')")
                                Icon.icon add
                li.group(
                    v-for="group in grouped.filter(g => _needToShowGroup()({...g, showCompleted}))" :key="group.due"
                    :class="{ 'all-done': group.homeworks.filter(o => o.progress < 1).length == 0 }"
                )
                    HeadingSub 
                        span.due.late(v-if="group.due === 'LATE'") En retard
                        span.due(v-else) {{ compoundDate(group.due) }}
                        button(
                            v-tooltip="'Tout marquer comme terminé'"
                            @click="markAllAsDone(group.homeworks)"
                        ): Icon done_all
                    ul.homework
                        li(v-for="hw in group.homeworks", :key="hw.uuid")
                            CardHomework(v-bind="hw")
        ScreenEmpty.empty(v-else @cta="$modal.show('add-homework')" @cta-secondary="showCompleted = true")
            template(#smiley) \o/
            p Bravo. Vous n'avez plus rien à travailler, pour le moment.
            template(#cta) Ajouter des devoirs
            template(#cta-secondary v-if="grouped.length > 0") Voir les devoirs terminés
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
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
import { formatDistance, format, getUnixTime, isSameWeek, isSameMonth, isSameYear, isTomorrow, fromUnixTime, isValid, differenceInDays, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'
import debounce from 'lodash.debounce'

export default {
    components: { CardHomework, ScreenEmpty, ModalAddHomework, ButtonNormal, VueContext, HeadingSub, Icon, Checkbox },
    head: {
        title: 'Devoirs'
    },
    computed: {
        ...mapGetters('homework', ['grouped']),
        ...mapState(['now']),
        showCompleted: {
            set(value) { this.setSetting({pk: 'show_completed_exercises', modifications: {value}}) },
            get() { return this.getSetting()('show_completed_exercises') }
        }
    },
    methods: {
        getUnixTime,
        ...mapGetters('homework', ['group', '_needToShowGroup']),
        ...mapActions('homework', ['post', 'switchCompletion']),
        ...mapMutations({ setSetting: 'settings/PATCH' }),
        ...mapGetters({ getSetting: 'settings/value' }),
        compoundDate(date) {
            if (date === 'LATE') return 'En retard'
            date = fromUnixTime(date)
            if (isToday(date))
                return "aujourd'hui"
            if (isTomorrow(date))
                return 'demain'
            
            let str = ""
            str += format(date, this.smartDateFormat(date), { locale: fr })
            if (differenceInDays(date, this.now) < 31) {
                str += ' — ' + formatDistance(date, this.now, { locale: fr, addSuffix: true })
            }
            return str
        },
        smartDateFormat(date) {
            if (isSameWeek(date, this.now))
                return 'cccc'
            if (isSameMonth(date, this.now))
                return 'cccc dd'
            if (isSameYear(date, this.now))
                return 'cccc dd MMM'
            else
                return 'cccc dd MMM yyyy'
        },
        async markAllAsDone(homeworks) {
            for (const hw of homeworks) {
                if (hw.progress != 1)
                    await this.switchCompletion({ uuid: hw.uuid, value: 1 })
            }
        }
    },
    async mounted() {
        this.$withLoadingScreen(async () => {
            await this.$store.dispatch('settings/load')
            await this.$store.dispatch('schedule/load')
            await this.$store.dispatch('homework/load')
        }, { title: "Feuilletage de l'agenda" })
    },
    watch: {
        showCompleted: debounce(async function(oldVal, value) {
            await this.$store.dispatch('settings/patch', { 
                key: 'show_completed_exercises', 
                modifications: {value} 
            })
        }, 1000)
    }
}
</script>

<style lang="stylus" scoped>
.container
    display flex
    justify-content center
    align-items flex-start
    padding 0 20px
.grades-wrapper
    display flex
    justify-content center
    flex-direction column
    &, & > *
        width: 500px
        max-width 100%
.Checkbox
.new
    display flex
    justify-content center
    margin-bottom 2rem
.new
    cursor pointer
    height: 5em
    .icon
        font-size 3em
        display flex
        align-items center
    background var(--blue-offset)
    color var(--blue)
    border-radius var(--border-radius)
    &:hover
        background var(--blue-offset-dark)
        color var(--blue-dark)
ul.homework li
    margin-bottom 1.2em
li.group
ul.homework-groups
    flex-direction column

//.container required to override the margin-left from layout:default.
.container h2
    display flex
    align-items center
    margin-bottom: 0.75em
    margin-top 3em
    width: 500px
    max-width 100%
    margin-left: 0
    .due
        margin-right 1em
    button
        margin-left auto
    .late, .late button
        color var(--red)

li.group.all-done button
    opacity: 0
    pointer-events none

@media (pointer fine)
    li.group:not(:hover) button
        opacity: 0
        pointer-events none

@media (pointer coarse), (pointer none)
    li.group:not(.all-done) button
        opacity: 1
        pointer-events auto

h2 button:hover
    color var(--blue)
.empty /deep/ .Checkbox
    margin-top: 0.5em
    font-size: 0.8em
    justify-content center
</style>
