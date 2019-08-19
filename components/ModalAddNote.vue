<template lang="pug">
.multimodal
    PickerSubject(parent-modal="add-note", dots)
    BaseModal(name="add-note", horizontal-items)
        SubjectDot(v-bind="subject", open-modal="subject-picker-add-note")
        InputFlat(
            placeholder="Titre..."
            v-bind="newNoteName"
            @input="newNoteName = $event"
            @keydown.enter="addNote"
        )
        ButtonFlat(icon="check" @click="$emit('confirm', $event)", close-modal)
</template>

<script>
import BaseModal from "~/components/BaseModal.vue";
import SubjectDot from "~/components/SubjectDot.vue";
import InputFlat from "~/components/InputFlat.vue";
import ButtonFlat from "~/components/ButtonFlat.vue";
import PickerSubject from "~/components/PickerSubject.vue";

export default {
  name: "ModalAddNote",
  components: {
    BaseModal,
    SubjectDot,
    InputFlat,
    ButtonFlat,
    PickerSubject
  },
  props: {
    subject: {
      type: Object,
      default: {
        color: "black",
        abbreviation: "..."
      }
    },
    newNoteName: String
  },
  methods: {
    async addNote() {
      console.log(`preparing to add a note named "${this.newNoteName}"`);
      try {
        const { data } = await this.$axios.post("/notes/", {
          content: `# ${this.newNoteName}\n`,
          name: this.newNoteName,
          subject: "english",
          filepath: `${this.subject}/${slugify(this.newNoteName)}.md`,
          last_modified: "2019-08-19T00:33"
        });
        this.$toast.success(
          `Note "${this.subject}/${this.newNoteName}.md" créée`
        );
        this.$toast.show("Ouverture de la note...");
        this.$router.push(`/notes/${this.subject}/${this.newNoteName}.md`);
      } catch (error) {
        this.$toast.error(`Erreur lors de la création de la note`);
      }
    }
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>