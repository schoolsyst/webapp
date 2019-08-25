<template lang="pug">
div.CardTestNoteItem
    .top
        span.name {{name}}
        span.progress-percentage {{progressDisp}}%
    .progress-bar(
        :data-progress="progress"
        :class="{'undefined': progress === -1}"
    )
        .progress-bar-total
    nuxt-link.learn(
        :to="`/learn/${uuid}/`",
        v-if="progress < 1"
    )
        i.material-icons(v-if="progress === -1") add
        i.material-icons(v-else) arrow_right
        span.btn-label Réviser
    p.learn.finished(v-else)
        i.material-icons check
        span.btn-label Révision terminée
</template>

<script>

export default {
    name: 'CardTestNoteItem',
    props: {
        name: String,
        progress: Number,
        uuid: String
    },
    computed: {
        progressDisp() {
            if (this.progress === -1) {
                return '?'
            } else {
                return this.progress * 100
            }
        },
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>