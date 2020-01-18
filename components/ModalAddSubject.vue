<template lang="pug">
  BaseModal(
    :name="modalName"
    title="Ajouter une matière..."
  )
    form.content(@submit.prevent="$emit('post', value); resetInputs(); $modal.close(modalName)")
      .color-and-name
        PickerColor(v-model="value.color" :namespace="modalName") Couleur
        InputField(
          v-model="value.name"
          variant="filled"
          name="name"
          v-bind="{validation}"
        ) Nom
      InputField(
        v-model="value.weight"
        variant="filled"
        name="weight"
        type="number"
        v-bind="{validation}"
        tabindex="3"
        no-error-messages
      ) Coefficient
      .submit: ButtonNormal(
        variant="primary"
        v-bind="{validation}"
        type="submit"
      ) Ajouter
</template>

<script>
import BaseModal from '~/components/BaseModal.vue'
import InputField from '~/components/InputField.vue'
import PickerColor from '~/components/PickerColor.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import { mapGetters } from 'vuex'

export default {
  components: { InputField, BaseModal, PickerColor, ButtonNormal },
  props: {
    value: {
      type: Object,
      default: () => ({
        color: '#000000',
        name: null,
        weight: null
      })
    },
    modalName: {
      type: String,
      default: 'add-subject'
    }
  },
  computed: {
    validation() {
      if (Object.keys(this.value).length === 0) return { validated: true, errors: {} }
      return this.validate()(this.value)
    },
  },
  methods: {
    ...mapGetters('subjects', ['validate']),
    resetInputs() {
      this.$emit('input', {})
    }
  }
}
</script>

<style lang="stylus" scoped>
.color-and-name
  display flex
  align-items center
  .color-picker
    font-size 1.25em
    & /deep/ .opener
      margin-top -.5em
      margin-right 1em
.submit
  margin-top 1.5em
  display flex
  justify-content flex-end
</style>
