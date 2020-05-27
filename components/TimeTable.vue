<template>
  <div class="--time-table">
    <ModalAddEvent
      v-model="editingEvent"
      action="edit"
      @submit="patch({ modifications: editingEvent, uuid: editingEvent.uuid })"
      @delete="del({ uuid: editingEvent.uuid })"
    ></ModalAddEvent>
    <v-stage :config="canvasConfig">
      <v-layer
        @click="handleEventClick"
        @mouseenter="handleHover"
        @mouseleave="handleHover"
        ><template v-for="event in events"
          ><v-rect
            :key="`${event.uuid}-rect`"
            :config="resolveRect(event)"
          ></v-rect
          ><v-text
            :key="`${event.uuid}-text`"
            :config="resolveText(event)"
          ></v-text></template
        ><template v-for="day in days"
          ><v-text :key="day.text" :config="day"></v-text
          ><template v-if="!allEventsAreOnBothWeeks"
            ><v-text
              :key="`${day.text}-even`"
              :config="weekTypes(day).even"
            ></v-text
            ><v-text
              :key="`${day.text}-odd`"
              :config="weekTypes(day).odd"
            ></v-text></template
        ></template>
      </v-layer>
    </v-stage>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
import { mapGetters, mapActions } from 'vuex'
import groupBy from 'lodash.groupby'
import clamp from 'lodash.clamp'
import { firstBy } from 'thenby'
import { parse } from 'date-fns'
// eslint-disable-next-line no-unused-vars
import * as Konva from 'konva'
import ModalAddEvent from '~/components/legacy/ModalAddEvent.vue'
import '~/types/api-resources'

export default Vue.extend({
  components: { ModalAddEvent },
  props: {
    showDeleted: {
      type: Boolean,
      default: true,
    } as PropOptions<boolean>,
    readOnly: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    bothWeeks: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    namespace: {
      type: String,
      default: '',
    } as PropOptions<string>,
    pixelsPerMinute: {
      type: Number,
      default: 1.5,
    } as PropOptions<number>,
    events: {
      type: Array,
      required: true,
    } as PropOptions<ApiResourceEvent[]>,
  },
  data() {
    const defaults = {
      subject: null,
      week_type: 'BOTH',
      day: null,
      start: null,
      end: null,
      room: null,
      identifier$action: 'edit',
    }
    return {
      editingEvent: {
        ...defaults,
        uuid: null,
      },
      recomputeCanvasWidth: 1,
      headerHeight: 50,
    }
  },
  computed: {
    dayNames(): string[] {
      const names = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
      if (this.colmunsCount >= 6) names.push('Samedi')
      if (this.colmunsCount === 7) names.push('Dimanche')
      return names
    },
    dayWidth(): number {
      return this.resolveWidth({ week_type: 'BOTH' })
    },
    days(): Konva.default.TextConfig[] {
      const dayConfigs = []
      // eslint-disable-next-line no-unused-vars
      for (const day of this.dayNames) {
        dayConfigs.push({
          text: day,
          y: 0,
          x: this.dayWidth * this.dayNames.indexOf(day),
          width: this.dayWidth,
          height: this.headerHeight / 2,
          fontSize: 20,
          fontFamily: 'Now',
          align: 'center',
        })
      }
      return dayConfigs
    },
    heightOfLongestDay(): number {
      // Get the latest event to end
      const latestEndingEvent = Math.max(...this.events.map(event => event.end))
      return latestEndingEvent - this.earliestStartTimeOfWeek
    },
    earliestStartTimeOfWeek(): number {
      // Mapping of day: events[]
      const eventsByDay = groupBy(this.events, 'day')
      // List of events[] grouped by day
      const eventsDayGrouped = Object.values(eventsByDay)
      // Get the length of each day
      const dayStarts = eventsDayGrouped.map(events => {
        const sorted = events.sort(firstBy('start'))
        const dayStart = sorted[0].start
        return dayStart
      })
      // Get the max length
      return Math.min(...dayStarts)
    },
    canvasConfig(): { width: number; height: number } {
      // Trick to allow for recomputation of values on window resize
      const windowWidth =
        window.innerWidth +
        this.recomputeCanvasWidth -
        +this.recomputeCanvasWidth
      return {
        // height: this.headerHeight + this.heightOfLongestDay, gives a strange NS_ERROR_FAILURE from konvaJS on ff only
        // it looks like any computation that involves this.events fails with the same error.
        // thus we assume calendars will be at most 12 hours long.
        height: this.headerHeight + 12 * 60 * this.pixelsPerMinute,
        // width: Math.min(windowWidth - 100, 1000)
        width: clamp(windowWidth - 100, 500, 1000),
      }
    },
    colmunsCount(): number {
      // Get an array of days of events (unique)
      const days = [...new Set(this.events.map(event => event.day))]
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
    },
    allEventsAreOnBothWeeks(): boolean {
      // Get all the events' week_types (unique)
      const weekTypes = [...new Set(this.events.map(event => event.week_type))]
      return !weekTypes.includes('Q1') && !weekTypes.includes('Q2')
    },
  },
  mounted() {
    window.addEventListener('resize', ev => {
      this.recomputeCanvasWidth += 1
    })
  },
  methods: {
    ...mapGetters(['textColor']),
    ...mapGetters('schedule', ['event']),
    ...mapActions('schedule', { patch: 'patchEvent', del: 'deleteEvent' }),
    weekTypes(
      day: any
    ): { even: Konva.default.TextConfig; odd: Konva.default.TextConfig } {
      const week = { ...day }
      week.y = this.headerHeight / 2
      week.width /= 2
      week.fontSize *= 0.75
      week.opacity = 0.5
      const evenWeek = { ...week }
      const oddWeek = { ...week }
      evenWeek.text = 'Paire'
      evenWeek.x = week.x
      oddWeek.text = 'Impaire'
      oddWeek.x += evenWeek.width
      return { even: evenWeek, odd: oddWeek }
    },
    // eslint-disable-next-line camelcase
    resolveWidth(event: { week_type: WeekType }): number {
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
    resolveHeight(event: ApiResourceEvent): number {
      // Get the duration of this event
      const duration = event.end - event.start
      // Multiply by the factor
      return (duration / 60) * this.pixelsPerMinute
    },
    resolvePosition(event: ApiResourceEvent) {
      // Get the day and multiply by the base width of an event
      const baseWidth = this.resolveWidth({ week_type: 'BOTH' })
      let x = baseWidth * event.day - baseWidth
      // If the event is in Q2, we need to offset it to the right
      if (event.week_type === 'Q2') x += baseWidth / 2
      // Get the difference between the start of the day and the start of this event,
      // Multiply by the height factor
      let y =
        ((event.start - this.earliestStartTimeOfWeek) / 60) *
        this.pixelsPerMinute
      // Make room for the table headers
      y += this.headerHeight
      return { x, y }
    },
    resolveRect(event: ApiResourceEvent) {
      const { x, y } = this.resolvePosition(event)
      return {
        width: this.resolveWidth(event),
        height: this.resolveHeight(event),
        x,
        y,
        fill: event.subject.color,
      }
    },
    resolveText(event: ApiResourceEvent) {
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
        id: event.uuid,
      }
    },
    handleEventClick(vueComponent: {
      target: { attrs: { id: string } }
      type: string
    }) {
      // The event's target element's id is the UUID
      const eventUUID = vueComponent.target.attrs.id
      // If the target element doesn't have an ID, we have nothing to handle
      if (!eventUUID) return
      // Get the element from the store with that UUID
      const event = this.event()(eventUUID)
      // Set the `editingEvent` data variable
      this.editingEvent = {
        ...event,
        start: parse(event.start, 'HH:mm:ss', new Date(0)),
        end: parse(event.end, 'HH:mm:ss', new Date(0)),
      }
      // Open the modal
      // @ts-ignore TODO: typescriptify plugins so that I don't have to do this
      this.$modal.open('edit-event')
    },
    handleHover(evt: { target: { attrs: { id: string } }; type: string }) {
      // this.$el's reported type is `Element`, which does not contain `.style`, so I'm typecasting it as an HTMLElement
      const canvas = this.$el as HTMLElement
      // Check if its an event
      if (!evt.target.attrs.id) return
      switch (evt.type) {
        case 'mouseenter':
          canvas.style.cursor = 'pointer'
          break

        case 'mouseleave':
          canvas.style.cursor = 'default'
          break
      }
    },
  },
})
</script>
