<template lang="pug">
div.CardTest(
    :style="{backgroundColor: subject.color}"
)
    .top-bar
        .text
            span.subject-abbr {{subject.abbreviation}}
            span.percentage {{totalProgressDisp}}%
        .current-progress(:data-progress="totalProgress")
    ul.notes
        li(v-for="note in notes" :key="note.uuid")
            CardTestNoteItem(v-if="expanded", v-bind="note")
            template(v-else) {{ note.name }}
    .infos(v-if="expanded")
        p.grade-and-room
            |sur 
            span.info {{grade[0].maximum}}] 
            |coef 
            span.info {{grade[0].weight}}] 
            |en 
            span.info {{room}}]
        p.date
            |le
            span.info {{moment(date, 'YYYY-MM-DD').format('DD MMMM YYYY')}}
    button.expand
        i.material-icons
            template(v-if="expanded") chevron_up
            template(v-else) chevron_down


</template>

<script>
import { mapGetters } from 'vuex';
import CardTestNoteItem from '~/components/CardTestNoteItem.vue'

export default {
    name: 'CardTest',

    components: {CardTestNoteItem},

    props: {
        subject: Object,
        name: String,
        due: String,
        note: Object
    },

    computed: {
        totalProgress() {
            if (!notes.length) return -1

            let totalProgress = 0
            this.notes.forEach(note => {
                if(note.progress !== -1) {
                    totalProgress += note.progress
                }
            });

            return totalProgress / this.notes.length
        },

        totalProgressDisp() {
            if (this.totalProgress === -1) return '?'
            return this.totalProgress * 100
        }
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>