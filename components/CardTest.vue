<template lang="pug">
div.CardTest(:style="{backgroundColor: subject.color, color: textColor}")
    .progress-infos
        span.subject-abbr {{subject.abbreviation}}
        span.percentage(v-if="totalProgressDisp !== '?'") {{totalProgressDisp}}%
    .top-bar
        .progress(
            :data-progress="totalProgress" 
            :style="{width: `calc(100% * ${totalProgress})`}"
        )

    p.details(v-if="details") {{details}}
    HeadingSub(v-if="notes.length") À apprendre
    ul.notes(:class="{'expanded': expanded}" v-if="notes.length")
        li(v-for="note in notes" :key="note.uuid")
            CardTestNoteItem(v-if="expanded", v-bind="note")
            template(v-else) {{ note.name }}
    //TODO: make the infos modifiable
    .infos(v-if="expanded")
        p.grade-and-room
            |sur 
            span.info {{gradeMax}}
            |coef 
            span.info {{gradeWeight}}
            |en 
            span.info {{room}}
        p.date
            |le 
            span.info {{dateDisp}}
    button.expand(@click="expanded = !expanded")
        i.material-icons
            template(v-if="expanded") expand_less
            template(v-else) expand_more


</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment'
import chroma from 'chroma-js'
//-----------------------------------
import CardTestNoteItem from '~/components/CardTestNoteItem.vue'
import HeadingSub from '~/components/HeadingSub.vue'

export default {
    name: 'CardTest',

    components: {CardTestNoteItem, HeadingSub},

    props: {
        subject: Object,
        name: String,
        due: String,
        notes: Array,
        grades: Array,
        room: String,
        details: String
    },

    data() { 
        return {
            expanded: false
        }
    },

    computed: {
        textColor(zone) {
            return chroma(this.subject.color).get('lab.l') < 70 ? 'white' : 'black'
        },
        dateDisp() {
            return moment(this.due, 'YYYY-MM-DD').format('DD/MM/YYYY')
        },
        gradeMax() {
            if (this.grades.length) return this.grades[0].maximum
            return '—'
        },
        gradeWeight() {
            if (this.grades.length) return this.grades[0].weight
            return '—'
        },
        totalProgress() {
            let knownProgressNoteCount = 0
            if (!this.notes.length) return -1

            let totalProgress = 0
            this.notes.forEach(note => {
                if(note.learnt !== -1 && note.learnt !== undefined) {
                    totalProgress += Number(note.learnt)
                    knownProgressNoteCount++
                }
            });

            if(knownProgressNoteCount < 1) return -1

            // return 0.7 // Just for testing

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

.CardTest
    border-radius: 10px
    color: black
    font-size: 24px
    overflow: hidden
    max-width: 520px

.notes, .details
    padding: 10px 30px
.details
    padding-top: 20px
.HeadingSub
    padding: 0 30px
    margin-top: 20px 
    font-size: 24px
.notes
    transition: height .25s ease
    li
        margin-bottom: 10px
    &.expanded li
        margin-bottom: 30px
.notes:not(.expanded) li:not(:last-child)::after
    content: ','
.notes:not(.expanded) li::before
    // content: '— '
    
.top-bar
    background: rgba(255,255,255,0.5)
    width: 100%
.progress
    display: grid
    grid-template-columns: repeat(2, 50%)
    height: 45px
    background: rgba(255, 255, 255, 0.5)
.progress-infos
    height: 0
    overflow: visible
    position: absolute
    padding: 2.5px 7.5px
    color: black
.percentage, .subject-abbr
    position: relative
    top: 5px
    font-size: 30px
    font-family: 'Roboto Mono', monospace
.percentage
    left: 10px
    text-align: right
.subject-abbr
    text-transform: uppercase

.details
    opacity: 0.75
.infos
    text-align: center
    line-height: 1.1
    font-size: 18px
    padding-bottom: 20px
    span.info
        font-weight: bold
        margin-right: 10px

.expand
    color: inherit
    &:focus
        //FIXME: no good for a11y
        outline: none
    i
        font-size: 56px
        color: inherit
    width: 100%
</style>