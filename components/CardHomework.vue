<template lang="pug">
    .card(
        @click="onClick"
        :class="{clicked, completed: progress >= 1}"
    )
        .complete-slider
            Icon check
        .infos
            .first-line
                SubjectDot.subject-color(v-bind="subject")
                span.name {{ name }}
            pre.details(v-if="details" v-html="details")
</template>

<script>
import Icon from '~/components/Icon.vue'
import SubjectDot from '~/components/SubjectDot.vue'
export default {
    components: { Icon, SubjectDot },
    props: {
        name: String,
        details: {
            type: String,
            default: ""
        },
        subject: Object,
        uuid: String,
        progress: Number
    },
    data() {
        return {
            clicked: false,
        }
    },
    methods: {
        async onClick() {
            this.clicked = true
            await setTimeout(async () => {
                this.clicked = false
                await this.$store.dispatch('homework/patch', this.uuid, {
                    progress: this.progress
                })
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
    .details
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
