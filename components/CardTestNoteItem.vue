<template lang="pug">
div.CardTestNoteItem
    .top
        span.name {{name}}
        span.progress-percentage #[input(:value="mutProgress" @input="updateProgress($event.target.value); uploadProgress()")]%
    .progress-bar-total(
        :class="{'undefined': mutProgress === '?', 'text-is-white': textIsWhite}"
    )
        .progress-bar(
            :data-progress="mutProgress"
            v-if="mutProgress !== '?'"
            :class="{'text-is-white': textIsWhite}",
            :style="{ \
                width: `calc(100% * ${progressWidth})`, \
            }"
        )
    nuxt-link.learn(
        :to="`/notes/${uuid}/`",
        v-if="mutProgress < 100 || mutProgress === '?'"
    )
        i.material-icons(v-if="mutProgress === '?'") add
        i.material-icons(v-else) arrow_forward
        span.btn-label Réviser
    p.learn.finished(v-else)
        i.material-icons check
        span.btn-label Révision terminée
</template>

<script>
import tinycolor from 'tinycolor2'
import debounce from 'lodash.debounce'
//-------------------------------
export default {
    name: 'CardTestNoteItem',
    props: {
        name: String,
        learnt: Number,
        uuid: String,
        subject: Object,
        testUuid: String
    },
    data() {
        let progress 
        if (this.learnt === -1 || this.learnt === undefined || this.learnt === null) {
            progress = '?'
        } else {
            progress = this.learnt * 100
        }    
        return {
            mutProgress: progress
        }
    },
    computed: {
        textIsWhite() {
            return chroma(this.subject.color).get('lab.l') < 70
        },

        progressWidth() {
            if (this.mutProgress !== '?') {
                return this.mutProgress / 100 
            } else {
                return 1
            }
        }   
    },
    methods: {
        updateProgress(percentage) {
            this.mutProgress = percentage
            let progress = percentage === '?' ? null : percentage/100 // Divide by 100 if not "?" else null
            this.$store.commit('notes/SET_NOTE_PROGRESS', {uuid: this.uuid, progress})
        },

        async _uploadProgress() {
            let progress = this.mutProgress === '?' ? null : this.mutProgress/100
            try {
                await this.$axios.patch(`/notes/${this.uuid}/`, {learnt: progress})
                this.$toast.success(`Progrès mis à jour avec succès`)
            } catch(error) {
                this.$toast.error(`Erreur lors de la mise à jour du progrès: ${error}`)
            }
        },
        uploadProgress: debounce(function() {
            this._uploadProgress()
        }, 500)
    }
}
</script>

<style lang="stylus" scoped>
.CardTestNoteItem > *
    margin-bottom 7.5px
.top
    display: grid
    grid-template-columns calc(100% - 75px) 75px
.progress-percentage
    text-align right
    font-family 'Roboto Mono', monospace
    input
        display inline
        color inherit
        max-width 50px
        text-align right
        font-family inherit
        margin-right 2px
        border solid 2px
dashed-bg(color)
    background repeating-linear-gradient(to right, color, color 30px, transparent 10px, transparent 40px)

.progress-bar-total
    height 10px
    width 100%
    &.undefined
        opacity .5
        &.text-is-white
            dashed-bg white
        &:not(.text-is-white)
            dashed-bg black
    &.text-is-white
        background rgba(255,255,255,0.5)
    &:not(.text-is-white)
        background rgba(0,0,0,0.5)
.progress-bar
    height 100%
    transition width 0.25s ease
    &.text-is-white
        background white
    &:not(.text-is-white)
        background black
.learn
    &.finished,
    &:hover,
    &:focus
        opacity 0.5
    &:not(.finished)
        cursor pointer
    display flex
    align-items center
    letter-spacing 3px
    text-transform uppercase
    font-weight bold
    font-size 24px
    i
        font-size 1.2em
        margin-right 2.5px
</style>