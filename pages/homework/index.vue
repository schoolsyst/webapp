<template lang="pug">
    .container
        ul.homework
            li(v-for="hw in all", :key="hw.uuid")
                CardHomework(v-bind="hw")
</template>

<script>
import CardHomework from '~/components/CardHomework.vue'
import { mapGetters } from 'vuex';
export default {
    components: { CardHomework },
    computed: {
        ...mapGetters('homework', ['all'])
    },
    async mounted() {
        await this.$store.dispatch('schedule/load')
        await this.$store.dispatch('homework/load')
    }
}
</script>

<style lang="stylus" scoped>
ul.homework li
    margin-bottom 2em
    justify-content center
    display flex

</style>
