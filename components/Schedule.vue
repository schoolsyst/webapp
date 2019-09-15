<template lang="pug">
.Schedule
    ModalCardEvent(v-bind="clickedEvent")
    .schedule-container
        .now-line(:style="{top: nowLineTop, display: nowLineDisplay}"): span.now-line-time {{now.format('HH:mm')}}
        .schedule(:style="{height: (lastCourseEnd - firstCourseStart) * pixelPerMinute + 'px'}")
            .schedule-day(
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
                        width: eventWidth.toString() + 'px', \
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
import tinycolor from 'tinycolor2'
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
    components: { ModalCardEvent, },

    props: {
        pixelPerMinute: {
            type: Number,
            default: 1.45
        },
        now: Object
    },

    data() {
        return {
            clickedEvent: {},
            eventWidth: 175,
            mobileEventWidth: 100
        }
    },

    computed: {
        ...mapGetters({
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
        date() {
            moment.locale('fr')
            let fmt = moment(this.now).format('dddd')
            return fmt.charAt(0).toUpperCase() + fmt.substr(1)
        },
        events() {
            let otherWeekType = this.getWeekType === 'Q1' ? 'Q2' : 'Q1'
            return this.coursesIn(
                moment(this.now).startOf('week'), 
                moment(this.now).endOf('week')
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
            let nowMins = moment(this.now).diff(moment('00:00:00', 'HH:mm:ss'), 'minutes')
            return Math.abs((nowMins - this.firstCourseStart) * this.pixelPerMinute).toString() + 'px'
        },
        nowLineDisplay() {
            let nowMins = moment(this.now).diff(moment('00:00:00', 'HH:mm:ss'), 'minutes')
            return nowMins <= this.lastCourseEnd ? '' : 'none'
        },
        mnmlMode() {
            return false
            return !!this.setting('mnml_mode')
        },
    },

    mounted() {
        if (window.innerWidth <= 1000) {
            this.eventWidth = this.mobileEventWidth
        }
    },

    methods: {
        getHeight(event, number=false) {
            this.pixelPerMinute 
            let start = moment(event.start, 'HH:mm:ss')
            let end   = moment(event.end,   'HH:mm:ss')
            let value = Math.abs(start.diff(end, 'minutes') * this.pixelPerMinute)
            return number ? value : value.toString() + 'px'
        },
        getTop(event, number=false) {
            let start = moment(event.start, 'HH:mm:ss').diff(moment('00:00:00', 'HH:mm:ss'), 'minutes')
            let value = Math.abs((start - this.firstCourseStart) * this.pixelPerMinute)
            return number ? value : value.toString() + 'px'
        },
        getLeft(event) {
            return (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(event.day) * this.eventWidth).toString() + 'px'
        },
        getTextColor(event) {
            return tinycolor(event.subject.color).isDark() ? 'white' : 'black'
        },
        openModal(event) {
            delete event.id // Conflicts with the BaseModal's id system (the event's id replaces the one used by the modal)
            this.clickedEvent = event
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.schedule-container
    overflow-x: auto
.mnml .event
    .subject, .room
        opacity: 0
.heading-detail
    font-size: 24px
.HeadingSub 
    margin-right: 50px
    font-size: 24px
.schedule
    position: relative
    height: 100vh
.schedule-day
    display: flex
    position: absolute
.event
    z-index: -1
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
        +mobile
            font-weight: normal
            font-size: 14px
            line-height: 20px
.now-line
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