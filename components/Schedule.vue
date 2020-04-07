<template lang="pug">
.--schedule
  ModalAddEvent(
    v-model="editingEvent"
    action="edit"
    @submit="patch({ modifications: editingEvent, uuid: editingEvent.uuid })"
    @delete="del({ uuid: editingEvent.uuid })"
  )
  v-stage(:config="canvasConfig"): v-layer(@click="handleEventClick")
    v-rect(
      v-for="(day, i) in days" :key="day"
      
    )
    template(v-for="event in events")
      v-rect(
        :key="event.uuid"
        :config="resolveRect(event)"
      )
      v-text(
        :config="resolveText(event)"
      )
</template>

<script>
import { mapGetters } from 'vuex'
import groupBy from 'lodash.groupby'
import { firstBy } from 'thenby'
import ModalAddEvent from '~/components/ModalAddEvent.vue'

export default {
  components: { ModalAddEvent },
  props: {
    showDeleted: {
      type: Boolean,
      default: true
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    bothWeeks: {
      type: Boolean,
      default: false
    },
    namespace: {
      type: String,
      default: ''
    },
    events: {
      type: Object,
      default: () => [
        {
          day: 1,
          room: 'L666',
          start: 8 * 3600,
          end: 9 * 3600,
          subject: {
            name: 'English',
            color: 'blue'
          },
          week_type: 'Q1'
        }
      ]
    }
  },
  data() {
    const defaults = {
      subject: null,
      week_type: 'BOTH',
      day: null,
      start: null,
      end: null,
      room: null,
      identifier$action: 'edit'
    }
    return {
      editingEvent: {
        ...defaults,
        uuid: null
      },
      recomputeCanvasWidth: 1
    }
  },
  computed: {
    days() {
      return null
    },
    heightOfLongestDay() {
      // Mapping of day: events[]
      const eventsByDay = groupBy(this.events, 'day')
      console.log(eventsByDay)
      // List of events[] grouped by day
      const eventsDayGrouped = Object.values(eventsByDay)
      // Get the length of each day
      const dayLengths = eventsDayGrouped.map((events) => {
        const sorted = events.sort(firstBy('start'))
        const length = sorted[sorted.length - 1].end - sorted[0].start
        return length
      })
      // Get the max length
      return Math.max(...dayLengths)
    },
    canvasConfig() {
      // Trick to allow for recomputation of values on window resize
      const windowWidth =
        window.innerWidth +
        this.recomputeCanvasWidth -
        +this.recomputeCanvasWidth
      return {
        height: (this.heightOfLongestDay / 60) * 1.5,
        width: Math.min(windowWidth - 100, 1000)
      }
    },
    colmunsCount() {
      // Get an array of days of events (unique)
      const days = [...new Set(this.events.map((event) => event.day))]
      // Work week (excluding weekends)
      let colmunsCount = 5
      // If we have saturday, bump the column count to 6
      if (days.includes(6)) {
        colmunsCount = 6
      }
      // If we have sunday, bump to 7 (the whole week)
      if (days.includes(7)) {
        colmunsCount = 7
      }
      return colmunsCount
    }
  },
  mounted() {
    window.addEventListener('resize', (ev) => {
      this.recomputeCanvasWidth += 1
    })
  },
  methods: {
    ...mapGetters(['textColor']),
    ...mapGetters('schedule', ['event']),
    resolveWidth(event) {
      // Get the total width the canvas should be
      const total = this.canvasConfig.width
      // The width is the total width divided by the number of columns there should be
      let width = total / this.colmunsCount
      // Half the width if its not on both week types
      if (event.week_type !== 'BOTH') {
        width /= 2
      }
      return width
    },
    resolveHeight(event) {
      // Get the duration of this event
      const duration = event.end - event.start
      // Multiply by the factor
      return (duration / 60) * 1.5
    },
    resolvePosition(event) {
      // Get the day and multiply by the base width of an event
      const baseWidth = this.resolveWidth({ week_type: 'BOTH' })
      let x = baseWidth * event.day - baseWidth
      // If the event is in Q2, we need to offset it to the right
      if (event.week_type === 'Q2') x += baseWidth / 2
      // Get the start time of the first event for this day
      const eventsOfDay = this.events.filter((e) => e.day === event.day)
      const startOfDay = Math.min(...eventsOfDay.map((e) => e.start))
      // Get the difference between the start of the day and the start of this event,
      // Multiply by the height factor
      const y = ((event.start - startOfDay) / 60) * 1.5
      return { x, y }
    },
    resolveRect(event) {
      const { x, y } = this.resolvePosition(event)
      return {
        width: this.resolveWidth(event),
        height: this.resolveHeight(event),
        x,
        y,
        fill: event.subject.color
      }
    },
    resolveText(event) {
      const rect = this.resolveRect(event)
      return {
        text: event.subject.name + '\n' + event.room,
        fontFamily: 'Now, sans-serif',
        y: rect.y,
        x: rect.x,
        width: rect.width,
        height: rect.height,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 15,
        wrap: 'none',
        ellipsis: true,
        padding: 3,
        fill: this.textColor()(rect.fill),
        lineHeight: 1.5,
        id: event.uuid
      }
    },
    handleEventClick(vueComponent) {
      const eventUUID = vueComponent.target.attrs.id
      this.editingEvent = this.event()(eventUUID)
      this.$modal.open('edit-event')
    }
  }
}
</script>
