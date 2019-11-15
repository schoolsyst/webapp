<template lang="pug">
  .root
    Checkbox(v-model="disabledStates") Disabled states
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
          td: ButtonReg(role="primary" :disabled="disabledStates" icon="check") Lorem ipsum
          td: ButtonFlat(role="primary" :disabled="disabledStates") Lorem Ipsum
          td: Checkbox(:disabled="disabledStates") Lorem ipsum
          td: RadioButtons(
                :disabled="disabledStates" 
                :values="{exercise: 'Exercice', dm: 'DM', tobring: 'À apporter', test: 'Contrôle'}"
              ) Type de devoir
          td: VueSelect(:options="['lol', 'mdr', 'xdlol']") heheh
        tr
          th Secondary
          td: ButtonReg(role="secondary" :disabled="disabledStates") Lorem ipsum
          td: ButtonFlat(role="secondary" :disabled="disabledStates" icon="check") Lorem Ipsum
        tr
          th Danger
          td: ButtonReg(role="danger" :disabled="disabledStates") Lorem ipsum
          td: ButtonFlat(role="danger" :disabled="disabledStates") Lorem Ipsum
</template>

<script>
import ArrayButton from '~/components/ArrayButton.vue'
import ButtonReg from '~/components/ButtonReg.vue'
import ButtonFlat from '~/components/ButtonFlat.vue'
import Checkbox from '~/components/Checkbox.vue'
import RadioButtons from '~/components/RadioButtons.vue'
import Dropdown from '~/components/Dropdown.vue'
import VueSelect from "nuxt-vue-select"

export default {
  components: {ArrayButton, ButtonReg, ButtonFlat, Checkbox, RadioButtons, Dropdown, VueSelect},
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
