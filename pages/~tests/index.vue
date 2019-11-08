<template lang="pug">
  .root
    input(type="checkbox" v-model="disabledStates")#disabled-states
    label(for="disabled-states") disabled states
    table
      thead
        tr
          th
          th(colspan="2") Button
          th Checkbox
          th Radio button
          th Dropdown
        tr
          th
          th Regular
          th Flat
      tbody
        tr
          th Primary
          td: ButtonReg(role="primary" :disabled="disabledStates") Lorem ipsum
          td: ButtonFlat(role="primary" :disabled="disabledStates") Lorem Ipsum
        tr
          th Secondary
          td: ButtonReg(role="secondary" :disabled="disabledStates") Lorem ipsum
          td: ButtonFlat(role="secondary" :disabled="disabledStates") Lorem Ipsum
        tr
          th Danger
          td: ButtonReg(role="danger" :disabled="disabledStates") Lorem ipsum
          td: ButtonFlat(role="danger" :disabled="disabledStates") Lorem Ipsum
</template>

<script>
import ArrayButton from '~/components/ArrayButton.vue'
import ButtonReg from '~/components/ButtonReg.vue'
import ButtonFlat from '~/components/ButtonFlat.vue'

export default {
  components: {ArrayButton, ButtonReg, ButtonFlat},
  data() {
    return {
      disabledStates: false
    }
  }
}
</script>

<style lang="stylus">
.root
  display flex
  flex-direction column
  justify-content center
  align-items center

th, td {
  border-bottom: 1px solid #ddd;
  padding: 20px
}
</style>
