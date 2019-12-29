<template lang="pug">
BaseButtonReg.ButtonRegSecondary(@click="$emit('click')" :icon="icon")
    slot
</template>

<script>
import BaseButtonReg from "~/components/BaseButtonReg.vue"

export default {
  name: "ButtonRegSecondary",
  components: {
    BaseButtonReg,
  },

  props: {
    icon: {
      type: String,
      default: "",
    },
  },
}
</script>

<style lang="sass">
@import '~/assets/defaults'

.ButtonRegSecondary
  background-color: var(--blue-offset)
  color: var(--blue)
</style>
