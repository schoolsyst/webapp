<template lang="pug">
  BaseModal(
    :name="modalName"
    title="Ajouter une matière..."
  )
    form.content(@submit.prevent="$emit('post', subjectObject); resetInputs(); $modal.close(modalName)")
      .color-and-name
        PickerColor(
          v-model="color"
          :namespace="modalName"
          tooltip="Choisir la couleur"
        ) Couleur
        InputField(
          v-model="name"
          variant="filled"
          name="name"
          v-bind="{validation}"
        ) Nom
      .grades-related
        InputField(
          v-model="weight"
          variant="filled"
          name="weight"
          type="number"
          v-bind="{validation}"
          tabindex="3"
          no-error-messages
        ) Coefficient
        InputField(
          v-model="goal"
          variant="filled"
          name="goal"
          type="number"
          v-bind="{validation}"
          tabindex="4"
          :placeholder="`sur ${gradesUnit}`"
          no-error-messages
        ) Objectif de moyenne
      .submit: ButtonNormal(
        variant="primary"
        v-bind="{validation}"
        type="submit"
      ) Ajouter
</template>

<script>
import { mapGetters } from 'vuex'
import BaseModal from '~/components/BaseModal.vue'
import InputField from '~/components/InputField.vue'
import PickerColor from '~/components/PickerColor.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'

export default {
  components: { InputField, BaseModal, PickerColor, ButtonNormal },
  props: {
    value: {
      type: Object,
      default: () => ({
        color: '#000000',
        name: null,
        weight: 1
      })
    },
    modalName: {
      type: String,
      default: 'add-subject'
    }
  },
  data() {
    return {
      name: null,
      color: '#000000',
      weight: 1,
      goal: null
    }
  },
  computed: {
    subjectObject() {
      return {
        name: this.name,
        weight: this.weight,
        color: this.color,
        goal: this.goal / this.gradesUnit
      }
    },
    validation() {
      return this.validate(this.$store.getters)(this.subjectObject)
    },
    gradesUnit() {
      return this.settingValue()('grade_max')
    }
  },
  watch: {
    value() {
      if (this.value) {
        const { name, weight, color } = this.value
        this.name = name
        this.weight = weight
        this.color = color
      }
    }
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('settings/load')
    })
  },
  methods: {
    ...mapGetters('subjects', ['validate']),
    ...mapGetters('settings', { settingValue: 'value' }),
    resetInputs() {
      this.name = ''
      this.color = '#000000'
      this.weight = 1
      this.goal = null
    }
  }
}
</script>

<style lang="stylus" scoped>
.color-and-name
  display: flex
  align-items: center

  .color-picker
    font-size: 1.25em

    & /deep/ .opener
      margin-top: -0.5em
      margin-right: 1em

.grades-related
  display flex
  align-items center
  .field:first-child /deep/ input
    max-width: 110px
  .field:nth-child(2) /deep/ input
    max-width: 200px
  .field:first-child
    margin-right 1rem

.submit
  margin-top: 1.5em
  display: flex
  justify-content: flex-end
</style>
