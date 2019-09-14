<template lang="pug">
.container
  TheHeading Rentrez vos matières
  ModalAddSubject(:subject="newSubject" no-edit-button)
  MainGroup(full-size)
    ArrayCardSubject
        li: ButtonLargeFlat(icon="plus", open-modal="add-subject", open-at="self.center.horizontal") Ajouter une {{ subjects.length ? 'autre' : 'matière'}}
        li(v-for="subject in subjects" :key="subject.uuid"): CardSubject(v-bind="subject")
</template>

<script>
//--- essentials ---
import axios from 'axios'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
//--- components ---
import TheHeading from '~/components/TheHeading.vue'
import MainGroup from '~/components/MainGroup.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import CardSubject from '~/components/CardSubject.vue'
import ModalAddSubject from '~/components/ModalAddSubject.vue'
import ButtonLargeFlat from '~/components/ButtonLargeFlat.vue'
import ArrayCardSubject from '~/components/ArrayCardSubject.vue'

export default {
    
    layout: 'bare',
    components: {
        TheHeading,
        MainGroup,
        HeadingSub,
        ModalAddSubject,
        CardSubject,
        ButtonLargeFlat,
        ArrayCardSubject
    },

    computed: {
        ...mapGetters({
            subjects: 'subjects'
        })
    },

    data() { return {
        newSubject: {
            color: '#fff',
            name: '',
            physical_weight: null,
            uuid: 'new' //for the modzl-id prop on <PickerColor>
        }
    }},
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.ArrayCardSubject
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
.TheHeading
    text-align: center
    margin-top: 10px
    margin-bottom: 50px
</style>
