<template lang="pug">
    .container
        ul.homework(v-if="!!all.length")
            li(v-for="hw in all", :key="hw.uuid")
                CardHomework(v-bind="hw")
        ScreenEmpty(v-else)
            template(#smiley) \o/
            p Bravo. Vous n'avez plus rien à travailler, pour le moment.
            template(#cta) Ajouter des devoirs
</template>

<script>
import CardHomework from '~/components/CardHomework.vue'
import ScreenEmpty from '~/components/ScreenEmpty.vue'
import { mapGetters } from 'vuex';
export default {
    components: { CardHomework, ScreenEmpty },
    computed: {
        ...mapGetters('homework', ['all'])
    },
    async mounted() {
        this.$loadingOverlay(async () => {
            await this.$store.dispatch('schedule/load')
            await this.$store.dispatch('homework/load')
        }, { title: "Feuilletage de l'agenda" })
    }
}
</script>

<style lang="stylus" scoped>
ul.homework li
    margin-bottom 2em
    justify-content center
    display flex

</style>
