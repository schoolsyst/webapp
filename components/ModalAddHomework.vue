<template lang="pug">
BaseModal(name="add-homework" title="Ajouter des devoirs")
  PickerSubject(parent-modal="add-homework" @pick="subject = $event")
  BadgeSubject.subject.badge(
    clickable
    @click="$modal.show('add-homework-subject-picker')"
    v-bind="subject"
  ).mobile-only
  SubjectDot.subject.dot(
    clickable
    @click="$modal.show('add-homework-subject-picker')"
    v-bind="subject"
  ).desktop-only
  InputField.name(
    v-model="name"
    placeholder="Nom de la note..."
    no-error-messages
    no-label
    variant="filled"
  )
  .notes-area
    InputField(
      name="notes" 
      type="block"  
    ) Notes additionnelles
  .due-area
    InputField(
      name="due" 
      type="date"
    ) À finir pour...
  .type-area
    RadioButtons(:values="homeworkTypes") Type de devoir
</template>

<script>
import BaseModal from '~/components/BaseModal.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import RadioButtons from '~/components/RadioButtons.vue'
import InputField from '~/components/InputField.vue'

export default {
  components: { BaseModal, PickerSubject, HeadingSub, RadioButtons, InputField },
  data() {
    return {
      homeworkTypes: [
        { key: "EXERCISE", label: "Exercice"      },
        { key: "TEST",     label: "Contrôle"      },
        { key: "DM",       label: "Devoir maison" },
        { key: "TOBRING",  label: "À apporter"    },
      ],
      subject: null,
      details: null,
      due: null,
      name: null
    }
  }
}
</script>
