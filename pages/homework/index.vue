<template>
<!-- COMPONENT TREE
Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

MainGroup
    MainGroupLeft
        HeadingAlt
            ArrayButtonFlat
                ButtonFlat
        ArrayButtonFlat
            CheckboxFlat
        HeadingSub
            ItemExercise
    MainGroupRight
        HeadingAlt
            ArrayButtonFlat
                ButtonFlat
        HeadingSub
            CardTest
        
-->

<div class="container">
    <TheHeading>Devoirs</TheHeading>
    <MainGroup>
        <MainGroupLeft>
            <HeadingAlt has-inline-buttons>
                Exercices&nbsp; <!-- <--FIXME: Cheap hack to align both plus signs on mobile, should do proper alignement -->
                <ButtonFlat class="add-homework" icon="add" inline large-icon></ButtonFlat></HeadingAlt>

        </MainGroupLeft>
        <MainGroupRight>
            <HeadingAlt has-inline-buttons>
                Contrôles
                <ButtonFlat class="add-homework" icon="add" inline large-icon></ButtonFlat></HeadingAlt>
            <ArrayButtonFlat>
                <DropdownFlat :options="sortingOptions" icon="sort" v-model="sortBy"></DropdownFlat>
            </ArrayButtonFlat>
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
import HeadingAlt from '~/components/HeadingAlt.vue'
import DropdownFlat from '~/components/DropdownFlat.vue'

export default {
    components: {
        TheHeading,
        ArrayButtonFlat,
        ButtonFlat,
        MainGroup,
        MainGroupLeft,
        MainGroupRight,
        HeadingSub,
        HeadingAlt,
        DropdownFlat
    },

    data() {
        return {
            sortBy: 'due',
            sortingOptions: [
                { value: 'due',     name: 'Date due' },
                { value: 'created', name: "Date d'ajout" },
            ],
            // API DATA
            
        }
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.add-homework
    margin-left: 70px

</style>

