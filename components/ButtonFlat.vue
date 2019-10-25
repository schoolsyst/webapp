<template lang="pug">
BaseFlatComponent.ButtonFlat(:icon="icon" :icon-style="iconStyle" :large-icon="largeIcon" :small="small")
    button.input(@click="$emit('click')")
        slot
</template>

<script>
import BaseFlatComponent from "~/components/BaseFlatComponent.vue"

export default {
  name: "ButtonFlat",

  components: {
    BaseFlatComponent,
  },

  props: {
    icon: String,
    iconStyle: {
      type: String,
      default: "outlined",
    },
    largeIcon: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {}
  },

  computed: {},

  created() {},

  methods: {},
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.ButtonFlat button
    &:hover, &:focus 
        color: var(--blue)

.ButtonFlat:focus, .ButtonFlat:hover
    outline-color: transparent
    color: var(--blue)

.ButtonFlat.disabled
    opacity: 0.25
    pointer-events: none

.input 
    color: inherit
    font-size: 1em


</style>
