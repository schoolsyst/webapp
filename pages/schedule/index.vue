<template>
<!-- COMPONENT TREE
Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

ArrayButtonFlat
MainGroup
    MainGroupLeft
    MainGroupRight
-->

<div class="container">
    <MainGroup>
        <MainGroupLeft>
            <HeadingSub></HeadingSub>
        </MainGroupLeft>
        <MainGroupRight>
            <TheHeading>{{weekday}}</TheHeading>
            <p class="heading-detail">Semaine du {{weekStartingDate}} au {{weekEndingDate}} ({{weekType}})</p>
            <HeadingSub>Cours reportés & supprimés</HeadingSub>
            <ButtonLargeFlat class="new-mutation">Nouvelle modification...</ButtonLargeFlat>
        </MainGroupRight>
    </MainGroup>
</div>
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
.TheHeading, .heading-detail
    text-align: right

.heading-detail 
    font-size: 24px

.HeadingSub 
    margin-right: 50px
    white-space: nowrap
    font-size: 24px

/* DESKTOP */
@media (min-width: 1000px) 
  .MainGroup:not(.full-size) 
    grid-template-columns: 1.5fr 1fr
  
  .container 
    margin: 30px 30px 0 0
</style>