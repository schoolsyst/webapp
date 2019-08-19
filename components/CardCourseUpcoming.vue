<template>
    <BaseCard class="CardCourseUpcoming" :style="{backgroundColor: subject.color}">
        <h4  class="name">{{subject.name}}</h4>
        <div class="room">{{room}}</div>
        <time class="remaining-time">
            <template v-if="timeRemaining.hours">
                Dans {{timeRemaining.hours}}h{{timeRemaining.minutes}}
            </template>
            <template v-else>
                Dans {{timeRemaining.minutes}} minutes
            </template>
        </time>
    </BaseCard>
</template>

<script>
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
            // parse date
            let $0, hours, mins, date, delta, minutes
            [$0, hours, mins] = this.start.match(/(\d+):(\d+)/)

            // convert into a Date object
            date = new Date(Date.now())
            date.setHours(hours)
            date.setMinutes(mins)

            // compute delta
            delta = new Date() - date
            delta /= 1000 // get in seconds
            delta *= -1 // invert the sign 
            
            // split into mins & hours
            hours = Math.floor( delta / 3600 )
            minutes = Math.round( (delta - hours*3600) / 60 )
            return {
                hours, 
                minutes
            }
        }
    },


    created() {

    },


    methods: {

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