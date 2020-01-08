<template lang="pug">
  BaseModal(
    :name="modalName"
    title="Ajouter une matière..."
  )
    .content
      InputField(
        v-model="value.name"
        variant="filled"
        name="name"
        v-bind="{validation}"
      ) Nom
      .color-and-weight
        PickerColor(v-model="value.color") Couleur
        InputField(
          v-model="value.weight"
          variant="filled"
          name="weight"
          type="number"
          v-bind="{validation}"
          no-error-messages
        ) Coefficient
      ButtonNormal.submit(variant="primary") Ajouter
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
        color: null,
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
      return this.validate(this.value)
    }
  },
  methods: {
    ...mapGetters('subjects', ['validate'])
  }
}
</script>

<style lang="stylus" scoped>
.color-and-weight
  display flex
  align-items center
.submit
  margin-top 1.5em
  display flex
  align-self flex-end
</style>
