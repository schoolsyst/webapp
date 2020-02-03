<template lang="pug">
  ModalObject(
    v-bind="{...description, action, validation}"
    @submit="$emit('submit')"
    @delete="$emit('delete')"
  )
    .color-and-name
      PickerColor(
        :value="value.color"
        @input="$emit('input', {...value, color: $event })"
        :namespace="modalName"
        tooltip="Choisir la couleur"
      ) Couleur
      InputField(
        :value="value.name"
        @input="$emit('input', {...value, name: $event })"
        variant="filled"
        name="name"
        v-bind="{validation}"
        no-error-messages
        no-error-styling
      ) Nom
    .grades-related
      InputField(
        :value="value.weight"
        @input="$emit('input', {...value, weight: $event })"
        variant="filled"
        name="weight"
        type="number"
        v-bind="{validation}"
        tabindex="3"
        no-error-messages
        no-error-styling
      ) Coefficient
      InputField(
        :value="goal !== null ? goal * gradesUnit : ''"
        @input="$emit('input', {...value, goal: $event / gradesUnit})"
        variant="filled"
        name="goal"
        type="number"
        v-bind="{validation}"
        tabindex="4"
        :placeholder="`sur ${gradesUnit}`"
        no-error-messages
        no-error-styling
      ) Objectif de moyenne
</template>

<script>
import { mapGetters } from 'vuex'
import ModalObject from '~/components/ModalObject.vue'
import InputField from '~/components/InputField.vue'
import PickerColor from '~/components/PickerColor.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'

export default {
  components: { InputField, ModalObject, PickerColor, ButtonNormal },
  props: {
    value: {
      type: Object,
      required: true
    },
    action: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      description: {
        name: 'subject',
        verboseName: 'matière',
        gender: 'F'
      },
      goal: null
    }
  },
  computed: {
    subjectObject() {
      return {
        name: this.value.name,
        weight: this.value.weight,
        color: this.value.color,
        goal: this.goal / this.gradesUnit
      }
    },
    validation() {
      return this.validate(this.$store.getters)(this.subjectObject)
    },
    gradesUnit() {
      return this.settingValue()('grade_max')
    },
    modalName() {
      return this.action + '-' + this.description.name
    }
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('settings/load')
    })
  },
  methods: {
    ...mapGetters('subjects', ['validate']),
    ...mapGetters('settings', { settingValue: 'value' })
  }
}
</script>

<style lang="stylus" scoped>
.color-and-name
  display: flex
  align-items: center
  margin-bottom: 2em

  .color-picker
    font-size: 1.25em

    & /deep/ .opener
      margin-top: 0.5em
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
