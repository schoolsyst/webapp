<template lang="pug">
//-
    COMPONENT TREE
    Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

    ArrayButtonFlat
    MainGroup
        MainGroupRight
        MainGroupLeft
        MainGroupRight

.container
    MainGroup
        MainGroupLeft
            TheHeading {{weekday}}
            p.heading-detail Semaine du {{weekStartingDate}} au {{weekEndingDate}} ({{weekType}})
            HeadingSub Cours reportés & supprimés
            ButtonLargeFlat.new-mutation Nouvelle modification…
        MainGroupRight
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TheHeading from '~/components/TheHeading.vue'
import ArrayButtonFlat from '~/components/ArrayButtonFlat.vue'
import ButtonFlat from '~/components/ButtonFlat.vue'
import MainGroup from '~/components/MainGroup.vue'
import MainGroupLeft from '~/components/MainGroupLeft.vue'
import MainGroupRight from '~/components/MainGroupRight.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import ArrayItemScheduleMutation from '~/components/ArrayItemScheduleMutation.vue'
import ItemScheduleMutation from '~/components/ItemScheduleMutation.vue'
import BarFloating from '~/components/BarFloating.vue'
import EventSchedule from '~/components/EventSchedule.vue'
import LineScheduleNow from '~/components/LineScheduleNow.vue'
import ButtonLargeFlat from '~/components/ButtonLargeFlat.vue'

export default {
    components: {
        TheHeading,
        ArrayButtonFlat,
        ButtonFlat,
        MainGroup,
        MainGroupLeft,
        MainGroupRight,
        HeadingSub,
        ArrayItemScheduleMutation,
        ItemScheduleMutation,
        BarFloating,
        EventSchedule,
        LineScheduleNow,
        ButtonLargeFlat,
    },

    data() {
        return {
            
        }
    },

    computed: {
        weekday: function() {
            return [
                'Lundi',
                'Mardi',
                'Mercredi',
                'Jeudi',
                'Vendredi',
                'Samedi',
                'Dimanche'
            ][new Date(Date.now()).getDay()]
        },
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.heading-detail 
    font-size: 24px

.HeadingSub 
    margin-right: 50px
    font-size: 24px

</style>

