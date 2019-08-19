<template lang="pug">
    BaseFlatComponent.InputFlat(:class="`input_${name}`" :icon="icon" :icon-style="iconStyle")
        input(
            class="input"
            :name="name"
            :id="`input_${name}`"
            :placeholder="placeholder"
            :type="type",
            :value="value"
            v-model="inputVal",
            @input="$emit('input', $event.target.value)",
            :autofocus="autofocus ? 'autofocus' : 'no'"
        )
        //- inside <input> : @input="$emit('input', $event.taget.value)"
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
      inputVal: this.value
    };
  },

  computed: {},

  created() {},

  methods: {}
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.input
    width: max-content

.input:focus
    outline: none

</style>