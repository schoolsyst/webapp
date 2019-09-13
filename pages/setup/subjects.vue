<template lang="pug">
.container
  ModalAddSubject
  MainGroup(full-size)
    ArrayCardSubject
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

export default {
    
    layout: 'bare',
    components: {
        TheHeading,
        MainGroup,
        HeadingSub,
        ModalAddSubject,
        CardSubject,
        ButtonLargeFlat
    },

    computed: {
        ...mapGetters({
            subjects: 'subjects'
        })
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.ArrayCardSubject
    display: flex
    align-items: center
    justify-content: center
</style>
