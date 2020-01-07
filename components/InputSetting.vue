<template lang="pug">
  .input(v-tooltip="description || false")
    template(v-if="type === 'SELECT'" )
      RadioButtons(
        v-if="choices.length < 5"
        :values="choices"
        :value="value"
        @input="setValue({key: _key, value: $event})"
        :name="_key"
      ) {{ name }}
      InputSelect(
        v-else
        :options="choices.map(c => ({key: c, label: c}))"
        :value="value"
        @input="setValue({key: _key, value: $event})"
        :name="_key"
        track-by="key" label="label"
      )
    template(v-else-if="type === 'BOOLEAN'")
      Checkbox(
        :value="value"
        @input="setValue({key: _key, value: $event})"
        :name="_key"
      ) {{ name }}
    template(v-else)
      //TODO: proper multiple field
      InputField(
        :value="value",
        @input="setValue({key: _key, value: $event })",
        :name="_key"
        :type="multiple ? 'block' : type.toLowerCase()"
        no-error-messages
      ) {{ name }}
</template>

<script>
import { mapActions } from 'vuex';
import InputField from '~/components/InputField.vue'
import InputSelect from '~/components/InputSelect.vue'
import RadioButtons from '~/components/RadioButtons.vue'
import Checkbox from '~/components/Checkbox.vue'

export default {
  components: { InputField, InputSelect, RadioButtons, Checkbox },
  props: {
    choices: [Array, Object],
    name: String,
    _key: String,
    value: [String, Boolean, Array, Number],
    multiple: Boolean,
    type: String,
    description: String
  },
  methods: {
    ...mapActions('settings', ['setValue'])
  }
}
</script>

<style lang="stylus" scoped>
.input
  max-width 500px
</style>
