<template lang="pug">
    .card(
        @click.self="onClick"
        :class="{clicked, completed: progress >= 1}"
    )
        .complete-slider
            Icon check
        .infos
            .first-line
                SubjectDot.subject-color(v-bind="subject")
                span.name {{ name }}
            pre.notes(v-if="notes.length > 0" v-html="treatNotes(notes)")
</template>

<script>
import Icon from '~/components/Icon.vue'
import SubjectDot from '~/components/SubjectDot.vue'
export default {
    components: { Icon, SubjectDot },
    props: {
        name: String,
        notes: String,
        subject: Object
    },
    data() {
        return {
            clicked: false,
        }
    },
    methods: {
        treatNotes(content) {
            content = content.length > 150 ? content.substring(0, 150) + '…' : content            
            return content.replace(/<<([^>]+)>>/g, ($0, $1) => `<a href="http://localhost:3000/${$1}">${$1}</a>`)
        },
        onClick() {
            this.clicked = true
            setTimeout(() => {
                this.clicked = false
                this.progress = this.progress === 1 ? 0 : 1 
            }, 500);
        }
    },
}
</script>

<style lang="stylus" scoped>
.card
    cursor pointer
    display flex
    // height: 100px
    width: 500px
    border 2px solid var(--grey-light)
    border-radius var(--border-radius)
    overflow hidden
.complete-slider
    width: 0
    overflow hidden
    background var(--blue)
    color var(--white)
    display flex
    align-items center
    transition width 0.25s ease
    flex-shrink 0
    z-index: 10
    i
        margin-left: 0.5em
.infos
    padding 20px 25px
    display flex
    flex-direction column
    .first-line
        align-items center
        display flex
        width 100%
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
    .name
        margin-left 0.5rem
    .notes
        margin-top .5em
        width 100%
        overflow hidden
        text-overflow ellipsis
        white-space wrap
        font-size: 0.75em
        flex-grow 0

.card.completed
    opacity: 0.5
.card:not(.completed):hover
    .complete-slider
        width 3em
.card:not(.completed).clicked
    .complete-slider
        width 100%
</style>
