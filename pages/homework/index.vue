<template lang="pug">
    .container
        ModalAddHomework(@click="post({homework: $event})")
        ul.homework(v-if="!!currentOrNextWeek.length")
            li(v-for="hw in currentOrNextWeek", :key="hw.uuid")
                CardHomework(v-bind="hw")
        ScreenEmpty(v-else @cta="$modal.show('add-homework')")
            template(#smiley) \o/
            p Bravo. Vous n'avez plus rien à travailler, pour le moment.
            template(#cta) Ajouter des devoirs
</template>

<script>
import CardHomework from '~/components/CardHomework.vue'
import ScreenEmpty from '~/components/ScreenEmpty.vue'
import ModalAddHomework from '~/components/ModalAddHomework.vue'
import { mapGetters, mapActions } from 'vuex';
export default {
    components: { CardHomework, ScreenEmpty, ModalAddHomework },
    head: {
        title: 'Devoirs'
    },
    computed: {
        ...mapGetters('homework', ['currentOrNextWeek'])
    },
    methods: {
        ...mapActions('homework', ['post'])
    },
    async mounted() {
        this.$withLoadingScreen(async () => {
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
