<template lang="pug">
  .input(v-tooltip="description || false")
    template(v-if="type === 'SELECT'" )
      RadioButtons(
        v-if="choices.length < 5"
        :values="choices"
        :value="value"
        @input="set({key: _key, value: $event})"
        :name="_key"
      ) {{ name }}
      InputSelect(
        v-else
        :options="verboseChoices"
        :value="value"
        @input="set({key: _key, value: $event})"
        :name="_key"
        track-by="key" label="label"
      )
    template(v-else-if="type === 'BOOLEAN'")
      Checkbox(
        :value="value"
        @input="set({key: _key, value: $event})"
        :name="_key"
      ) {{ name }}
    template(v-else)
      //TODO: proper multiple field
      InputField(
        :value="value",
        @input="set({key: _key, value: $event })",
        :name="_key"
        :type="multiple ? 'block' : type.toLowerCase()"
        no-error-messages
      ) {{ name }}
</template>

<script>
import { mapActions, mapState } from 'vuex'
import InputField from '~/components/InputField.vue'
import InputSelect from '~/components/InputSelect.vue'
import RadioButtons from '~/components/RadioButtons.vue'
import Checkbox from '~/components/Checkbox.vue'

export default {
  components: { InputField, InputSelect, RadioButtons, Checkbox },
  props: {
    choices: {
      type: [Array, Object, String],
      default: () => []
    },
    name: String,
    _key: String,
    value: {
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    type: String,
    description: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('settings', ['verboseChoices']),
    verboseChoices() {
      const choices = []
      this.choices.forEach((choice) => {
        const verboseChoice = this.verboseChoices.hasOwnProperty(choice)
          ? this.verboseChoices[choice]
          : choice
        choices.push({ key: choice, label: verboseChoice })
      })
      return choices
    }
  },
  methods: {
    ...mapActions('settings', ['setValue']),
    async set({ key, value }) {
      await this.setValue({ key, value })
      this.$emit('value-set', { key, value })
    }
  }
}
</script>

<style lang="stylus" scoped>
.input
  max-width: 500px
</style>
