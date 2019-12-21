<template lang="pug">
    .card(
        @click="$emit('click')"
        :class="{completed, opened}"
    )
        .complete-slider(@click="toggleComplete" :title="sliderTooltip")
            Icon(v-show="completed") close
            Icon(v-show="!completed") check
        .infos
            .first-line
                .strikethrough-line
                BadgeSubject.subject-color(v-bind="subject" variant="dot")
                span.name {{ name }}
                Icon.graded-indicator(v-if="['DM', 'TEST'].includes(type)" v-tooltip="'Noté'").
                    error_outline
            pre.details(v-if="details" v-html="details")
</template>

<script>
import Icon from '~/components/Icon.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import InputField from '~/components/InputField.vue'
import debounce from 'lodash.debounce'
import { mapActions, mapGetters } from 'vuex'
export default {
    components: { Icon, BadgeSubject, InputField },
    props: {
        name: String,
        details: {
            type: String,
            default: ""
        },
        subject: Object,
        uuid: String,
        progress: Number,
        opened: {
            type: Boolean,
            default: false
        },
        type: String
    },
    computed: {
        completed() {
            return this.progress >= 1
        },
        sliderTooltip() {
            return `Marquer comme ${this.completed ? 'non-' : ''}terminé`
        }
    },
    methods: {
        ...mapActions('homework', ['switchCompletion']),
        ...mapGetters('homework', ['one']),
        toggleComplete: debounce(async function () {
            await this.switchCompletion({ uuid: this.uuid })
        }, 500, { leading: true, trailing: false })
    },
}
</script>

<style lang="stylus" scoped>
.card
    cursor pointer
    display flex
    // height: 100px
    width: 500px
    overflow hidden
    border-radius var(--border-radius)
    transition box-shadow 0.25s ease
.strikethrough-line
    --strikethrough-line-offset: 0px
    height 0.1em
    background var(--black)
    position absolute
    top: 50%
    left: calc((100% - (100% - (var(--strikethrough-line-offset) * 2))) / 2)
    width: 0
    transition: width 0.25s ease
.card.completed .complete-slider
    background-color var(--red)
.card:not(.completed) .complete-slider
    background-color var(--green)
.complete-slider
    width: 0
    overflow hidden
    color var(--white)
    display flex
    align-items center
    transition width 0.25s ease
    flex-shrink 0
    z-index: 10
    border-radius var(--border-radius)
    border-top-right-radius 0
    border-bottom-right-radius 0
    i
        margin-left: 0.5em
.infos
    padding 1.1em 1.2em
    border 1px solid var(--grey-light)
    border-radius var(--border-radius)
    width 100%
    display flex
    flex-direction column
    position relative
    .first-line
        align-items center
        display flex
        width 100%
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        position relative
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
    .graded-indicator
        font-size: 1.3em
        margin-left auto    

.card.completed
    .infos
        opacity: 0.5
    .strikethrough-line
        width calc(100% - (var(--strikethrough-line-offset) * 2))
.card:hover
    &
        box-shadow var(--shadow-2)
    .complete-slider
        width 3em
    &.completed .complete-slider:hover
        background-color var(--red-light)
    &:not(.completed) .complete-slider:hover
        background-color var(--green-light)
    .infos
        border-top-left-radius 0px
        border-bottom-left-radius 0px
        border-left 0px
</style>
