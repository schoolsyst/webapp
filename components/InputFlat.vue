<template lang="pug">
BaseFlatComponent.InputFlat(:class="`input_${name}`" :icon="icon" :icon-style="iconStyle")
    input(
        class="input"
        :name="name"
        :id="`input_${name}`"
        :placeholder="placeholder"
        :type="type",
        :value="inputVal"
        @input="inputVal = $event.target.value; $emit('input', $event.target.value)",
        :autofocus="autofocus ? 'autofocus' : 'no'"
    )
</template>

<script>
import BaseFlatComponent from "~/components/BaseFlatComponent.vue";

export default {
  name: "InputFlat",

  components: {
    BaseFlatComponent
  },

  props: {
    icon: String,
    iconStyle: {
      type: String,
      default: "outlined"
    },
    name: String,
    value: String,
    placeholder: String,
    type: {
      type: String,
      default: "text"
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      inputVal: this.value,
    };
  },

  computed: {
  },

  watch: {
    value(newVal, oldVal) {
      this.inputVal = newVal
    }
  },

  methods: {}
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.input
    width: auto
    overflow: hidden
    height: 48px // fix lower case g being cut

.input:focus
    outline: none

</style>