<template lang="pug">
BaseModal(
  name="add-homework" 
  title="Ajouter des devoirs" 
  resizable="both"
)
  .content
    PickerSubject(parent-modal="add-homework" @pick="subject = $event")
    .header
      BadgeSubject(
        clickable
        @click="$modal.show('add-homework-subject-picker')"
        v-bind="subject"
        variant="responsive"
      )
      InputField.name(
        v-model="name"
        name="name"
        v-bind="{validation}"
        placeholder="Titre"
        no-error-messages, no-label
        variant="filled"
      )
    .-side-by-side
      .left
        InputField.details(
          v-model="details"
          v-bind="{validation}"
          name="details" 
          type="block"  
          variant="filled"
        ) Détails
      .right
        RadioButtons.type(
          v-model="type"
          v-bind="{validation}"
          name="type"
          variant="filled"
          :values="types" 
        ) Type de devoir
        InputField.due(
          v-model="due"
          v-bind="{validation}"
          name="due" 
          type="date"
          variant="filled"
          no-error-messages
        ) À {{dueLabelVerb}} pour le
    .submit-area
      ButtonNormal(
        v-bind="{validation}"
        @click="$emit('click', homeworkObject)"
      ) Ajouter
</template>

<script>
import BaseModal from '~/components/BaseModal.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import RadioButtons from '~/components/RadioButtons.vue'
import InputField from '~/components/InputField.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  components: { BaseModal, PickerSubject, HeadingSub, RadioButtons, InputField, ButtonNormal, BadgeSubject },
  data() {
    return {
      details: null,
      due: null,
      name: null,
      mSubject: null,
      type: 'EXERCISE'
    }
  },
  computed: {
    ...mapState('homework', ['types']),
    ...mapGetters('schedule', ['currentSubject']),
    subject: {
      get: function() { return this.mSubject || this.currentSubject },
      set: function(newSubject) { this.mSubject = newSubject }
    },
    validation() {
      return this.validate()(this.homeworkObject)
    },
    dueLabelVerb() {
      return {
        EXERCISE: 'faire',
        TOBRING: 'apporter',
        DM: 'faire',
        TEST: 'réviser'
      }[this.type]
    },
    homeworkObject() {
      return {
        subject: this.subject,
        type: this.type,
        due: this.due,
        name: this.name,
        details: this.details
      }
    }
  },
  methods: {
    ...mapGetters('homework', ['validate']),
  }
}
</script>

<style lang="stylus" scoped>
.content
  height 100%
  display grid
  grid-template-rows 1fr 3fr 1fr

.header
  display flex
  align-items center
  @media (max-width 650px)
    flex-direction column
    justify-content center
  .subject
    margin-right 0.5em
    @media (min-width 651px)
      max-width 33%
      font-size 1.75rem
    @media (max-width 650px)
      margin-bottom: 1.5rem
      font-size 1.25rem
      width 100%
  .name
    width 100%

.details
    height 100%
.type
  flex-direction column
  & /deep/ .RadioButton:not(:last-child)
    margin-bottom 0.5em
  margin-bottom 1em
  margin-top: 0.75em //FIXME: Pixel perfect. (to vertically line it up w/ the .details field)
.submit-area
  margin-top 2rem
  display flex
  justify-content flex-end
  align-items flex-end
</style>
