<template lang="pug">
//-
    COMPONENT TREE
    Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

    ArrayButtonFlat
    MainGroup
        MainGroupRight
        MainGroupLeft
        MainGroupRight

.container(:class="{'mnml': mnmlMode}")
    ModalCardEvent(v-bind="clickedEvent")
    MainGroup
        MainGroupLeft
            TheHeading {{date}}
            p.heading-detail 
                | Semaine du {{scheduleNow.startOf('week').format('D/M')}} 
                | au {{scheduleNow.endOf('week').format('D/M')}} 
                | ({{weekType}})
            HeadingSub Cours reportés & supprimés
            ButtonLargeFlat.new-mutation Nouvelle modification…
        MainGroupRight
            .da-now-line(:style="{top: nowLineTop, display: nowLineDisplay}"): span.now-line-time {{now.format('HH:mm')}}
            .da-schedule-magueule
                .da-schedule-day-magueule(
                    v-for="events in eventsOfDays"
                    :key="events.day"
                )
                    .event(
                        v-for="ev in events.events"
                        :key="ev.start"
                        :style="{ \
                            backgroundColor: ev.subject.color, \
                            height: getHeight(ev), \
                            top: getTop(ev), \
                            left: getLeft(ev), \
                            width: EVENT_WIDTH.toString() + 'px', \
                            color: getTextColor(ev),\
                        }"
                        @click="openModal(ev)"
                        open-modal="event-card"
                        open-at="self"
                    )
                        p.subject {{ev.subject.abbreviation}}
                        p.room {{ev.room}}
</template>

<script>
import moment from 'moment';
import chroma from 'chroma-js'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
//-------------------------------------------------------------------
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
import ModalCardEvent from '~/components/ModalCardEvent.vue'

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
        ModalCardEvent,
    },

    data() {
        return {
            scheduleNow: moment(),
            now: moment(),
            //TODO: dynamically determine PX_PER_MIN & EVENT_WIDTH to fit neatly into 100vh & 2/3*100vw
            PX_PER_MIN: 1.45, // height: 2 pixels / minute of the event duration
            EVENT_WIDTH: 175, //in pixels
            clickedEvent: {}
        }
    },

    created() {
        setInterval(() => {
            this.now = moment()
        }, 1000);
    },

    computed: {
        ...mapGetters({
            getWeekType: 'schedule/weekType',
            coursesIn: 'schedule/coursesIn',
            event: 'schedule/event',
            setting: 'setting'
        }),
        firstCourseStart() {
            return Math.min(...this.events.map(ev => {
                let st = moment(ev.start, 'HH:mm:ss')
                return st.diff(moment('00:00:00', 'HH:mm:ss'), 'minutes')
            }))
        },
        lastCourseEnd() {
            return Math.max(...this.events.map(ev => {
                let st = moment(ev.end, 'HH:mm:ss')
                return st.diff(moment('00:00:00', 'HH:mm:ss'), 'minutes')
            }))
        },
        weekType() {
            return this.getWeekType(this.scheduleNow.format('YYYY-MM-DD'))
        },
        date() {
            moment.locale('fr')
            let fmt = moment().format('dddd')
            return fmt.charAt(0).toUpperCase() + fmt.substr(1)
        },
        events() {
            let otherWeekType = this.getWeekType === 'Q1' ? 'Q2' : 'Q1'
            return this.coursesIn(
                moment().startOf('week'), 
                moment().endOf('week')
            ).filter(e => e.weekType !== otherWeekType)
        },
        eventsOfDays(day) {
            let ofDay = (day) => this.events.filter(e => e.day === day)
            let days = []
            let daynames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            daynames.forEach(day => {
                days.push({
                    day: day,
                    dayindex: daynames.indexOf(day),
                    events: ofDay(day)
                })
            })
            console.log(days)
            return days
        },
        nowLineTop() {
            let nowMins = this.now.diff(moment('00:00:00', 'HH:mm:ss'), 'minutes')
            return Math.abs((nowMins - this.firstCourseStart) * this.PX_PER_MIN).toString() + 'px'
        },
        nowLineDisplay() {
            let nowMins = this.now.diff(moment('00:00:00', 'HH:mm:ss'), 'minutes')
            return nowMins <= this.lastCourseEnd ? '' : 'none'
        },
        mnmlMode() {
            return false
            return !!this.setting('mnml_mode')
        }
    },

    methods: {
        getHeight(event) {
            this.PX_PER_MIN 
            let start = moment(event.start, 'HH:mm:ss')
            let end   = moment(event.end,   'HH:mm:ss')
            return Math.abs(start.diff(end, 'minutes') * this.PX_PER_MIN).toString() + 'px'
        },
        getTop(event) {
            let start = moment(event.start, 'HH:mm:ss').diff(moment('00:00:00', 'HH:mm:ss'), 'minutes')
            return Math.abs((start - this.firstCourseStart) * this.PX_PER_MIN).toString() + 'px'
        },
        getLeft(event) {
            return (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(event.day) * this.EVENT_WIDTH).toString() + 'px'
        },
        getTextColor(event) {
            return chroma(event.subject.color).get('lab.l') < 70 ? 'white' : 'black'
        },
        openModal(event) {
            delete event.id // Conflicts with the BaseModal's id system (the event's id replaces the one used by the modal)
            console.log(event.room)
            this.clickedEvent = event
            console.log(this.clickedEvent)
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.mnml .event
    .subject, .room
        opacity: 0
.heading-detail
    font-size: 24px
.HeadingSub 
    margin-right: 50px
    font-size: 24px
.da-schedule-magueule
    overflow-x: scroll
.da-schedule-day-magueule
    display: flex
    position: absolute
.event
    cursor: pointer
    position: absolute
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column
    .subject
        text-transform: uppercase
    .subject, .room
        font-weight: bold
        font-size: 18px
        line-height: 24px
.da-now-line
    z-index: 10
    width: 100%
    background: #000000
    height: 10px
    position: relative
    pointer-events: none
.now-line-time
    position: absolute
    left: -80px
    bottom: -5px
    font-size: 24px
    font-family: 'Roboto Mono', monospace
</style>

