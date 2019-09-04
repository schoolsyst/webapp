<template lang="pug">
BaseModal.ModalCardEvent(name="event-card")
    .subject
        SubjectDot(v-bind="subject")
        span.name {{subject.name}}
    .time
        span.day {{getFrenchWeekday(day)}}
        span.start {{formatTime(start)}}
        i.arrow.material-icons trending_flat
        span.end {{formatTime(end)}}
    .room
        LabelFlat(for="field_modal-card-event-room") Salle
        //FIXME: the room isn't taken into account
        input#field_modal-card-event-room(v-model="mutRoom")
    .homework
        LabelFlat Devoirs pour ce cours
        ul
            li
                ul
                    li(v-for="exercise in homework.exercises" :key="exercise.uuid")
            li
                ul
                    li(v-for="test in homework.tests" :key="test.uuid")
    .report-or-delete
        ButtonRegSecondary Reporter/Supprimer
    
</template>

<script>

import debounce from 'lodash.debounce'
//------------------------------------------------------------------
import BaseModal from '~/components/BaseModal.vue'
import ButtonRegSecondary from '~/components/ButtonRegSecondary.vue'
import SubjectDot from '~/components/SubjectDot.vue'
import LabelFlat from '~/components/LabelFlat.vue'
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
    name: 'ModalCardEvent',
    components: {ButtonRegSecondary, SubjectDot, LabelFlat, BaseModal},
    props: {
        subject: {
            type: Object,
            default: () => {return {name: '...'}}
        },
        room: {
            type: String,
            default: '—'
        },
        start: String,
        end: String,
        uuid: String,
        day:String,
        homework: {
            type: Object,
            default: () => {return {exercises: [], tests: []} }
        }
    },
    data() {
        return {
            mutRoom: this.room
        }
    },
    computed: {
        ...mapGetters({
            homeworkOf: 'homework/'
        })
    },
    watch: {
        mutRoom: debounce(function() {
            this.updateRoom()
        }, 1000)
    },
    methods: {
        async updateRoom() {
            try {
                const { data } = await this.$axios.patch(`/events/${this.uuid}`, {room:this.mutRoom})
                this.$store.commit('schedule/CHANGE_EVENT', this.uuid, {room:this.mutRoom})
                this.$toast.success(`Salle modifiée avec succès`)
            } catch(error) {
                this.$toast.error(`Erreur lors de la modification de la salle: ${error}`)
            }
        },
        formatTime(time) {
            return moment(time, 'HH:mm:ss').format('HH:mm')
        },
        getFrenchWeekday(weekday) {
            return {
                monday: 'Lundi',
                tuesday: 'Mardi',
                wednesday: 'Mercredi',
                thursday: 'Jeudi',
                friday: 'Vendredi',
                saturday: 'Samedi',
                sunday: 'Dimanche'
            }[weekday]
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.subject
    display: flex
    align-items: center
    margin-bottom: -5px
    .name
        font-size: 24px
        margin-left: 10px

.time
    margin-bottom: 20px
    display: flex
    align-items: center
    padding-left: 50px //<-- SubjectDot's width + margin (to align to it)
    font-size: 20px
    .day
        margin-right: 10px
    .arrow
        margin: 0 2.5px

.room input
    font-size: 36px
    max-width: 100px
</style>