<template lang="pug">
    BaseCard(class="CardCourseUpcoming" :style="{backgroundColor: subject.color}")
        h4.name {{subject.name}}
        div.room {{room}}
        time.remaining-time {{ timeRemaining.capFirstChar() }}
</template>

<script>
import moment from 'moment'
import BaseCard from '~/components/BaseCard.vue'

export default {
    name: 'CardCourseUpcoming',

    components: {
        BaseCard
    },

    props: {
        subject: {
            type:Object,
            required: true
        },
        start: {
            // HH:MM
            validator: function(value) { return value.match(/\d+:\d+/) },
            required: true
        },
        room: {
            type:String,
            required: true
        },
        start: {
            type:String,
            required: true
        },
    },


    data() {
        return {
            
        }
    },

    computed: {
        timeRemaining() {
            moment.locale('fr')
            return moment(this.start, 'hh:mm').fromNow()
        }
    },


    created() {

    },


    created() {
        String.prototype.capFirstChar = function () {
        return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase()
        };
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.CardCourseUpcoming 
    height: 250px
    display: grid
    grid-template-columns: repeat(2, 1fr)
    grid-template-rows: 1fr
    max-width: 500px
    padding: 10px

.name 
    color: white
    font-size: 56px
    grid-column: 1/ span 2
    grid-row: 1
    line-height: 56px
    height: 175px


.room, .remaining-time 
    color: white
    font-size: 24px
    grid-row: 2

.room 
    grid-column: 1

.remaining-time 
    grid-column: 2
    text-align: right

</style>