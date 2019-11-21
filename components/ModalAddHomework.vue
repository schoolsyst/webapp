<template lang="pug">
.multimodal
  PickerSubject(parent-modal="add-homework" @pick="pickSubject")
  BaseModal(name="add-homework" show-close-button)
    .title-area
      p Ajouter des devoirs
    .name-area
      InputFlat(name="name" placeholder="Titre du devoir…" big)
    .notes-area
      TextBlockInput(name="notes" placeholder="Notes additionnelles…")
    .due-area
      HeadingSub À finir pour…
      InputFlat(name="due" placeholder="JJ/MM/AAAA")
    .type-area
      RadioButtons(:values="homeworkTypes") Type de devoir
</template>

<script>
import BaseModal from '~/components/BaseModal.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import RadioButtons from '~/components/RadioButtons.vue'

export default {
  components: { BaseModal, PickerSubject, HeadingSub, RadioButtons },
  data() {
    return {
      homeworkTypes: [
        { key: "EXERCISE", label: "Exercice"      },
        { key: "TEST",     label: "Contrôle"      },
        { key: "DM",       label: "Devoir maison" },
        { key: "TOBRING",  label: "À apporter"    },
      ]
    }
  }
}
</script>
