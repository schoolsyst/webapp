<template lang="pug">
BaseButtonReg.ButtonRegSecondary
    slot
</template>

<script>
import BaseButtonReg from "~/components/BaseButtonReg.vue";

export default {
  name: "ButtonRegSecondary",
  components: {
    BaseButtonReg
  },
};
</script>

<style lang="sass">
@import '~/assets/defaults'

.ButtonRegSecondary
  background-color: var(--offset-blue)
  color: var(--blue)
</style>