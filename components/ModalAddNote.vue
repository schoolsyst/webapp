<template lang="pug">
.multimodal
    PickerSubject(
      parent-modal="add-note"
      @pick="pickSubject",
    )
    BaseModal(name="add-note", horizontal-items)
        SubjectDot(
          v-bind="mutSubject", 
          open-modal="add-note-subject-picker", 
          open-at="self"
        )
        InputFlat(
            placeholder="Titre..."
            :value="newNoteName"
            @input="newNoteName = $event"
            @keydown.enter.native="addNote"
            modal-autofocus
            name="title"
        )
        ButtonFlat(icon="check" @mouseup.native="addNote")
</template>

<script>
import slugify from "slugify";
import BaseModal from "~/components/BaseModal.vue";
import BadgeSubject from "~/components/BadgeSubject.vue";
import SubjectDot from "~/components/SubjectDot.vue";
import InputFlat from "~/components/InputFlat.vue";
import ButtonFlat from "~/components/ButtonFlat.vue";
import PickerSubject from "~/components/PickerSubject.vue";
import moment from "moment";

export default {
  name: "ModalAddNote",
  components: {
    BaseModal,
    SubjectDot,
    InputFlat,
    ButtonFlat,
    PickerSubject,
    BadgeSubject
  },
  props: {
    subject: {
      type: Object,
      default: () => {
        return {
          color: "black",
          abbreviation: "..."
        };
      }
    }
  },
  data() {
    return {
      newNoteName: "",
      mutSubject: this.subject
    };
  },
  computed: {},
  mounted() {
    if (!this.$store.subjects) {
      this.$axios.get("/subjects/").then(response => {
        this.$store.commit("SET_SUBJECTS", response.data);
      });
    }
    /* document.querySelectorAll(`#modal_${this.name} [confirm-modal]`).forEach(e => {
      e.addEventListener()
    }) */
  },
  methods: {
    async addNote() {
      let errs = [];
      console.log(`ADD NOTE [${this.mutSubject.abbreviation.toUpperCase()}] "${this.newNoteName}"`);
      // --- validate data ---
      if (!this.newNoteName) {
        errs.push("Donnez un nom à cette note");
      }
      if ("_isPlaceholder" in this.mutSubject) {
        errs.push("Sélectionnez une matière avec le rond à gauche du titre");
      }
      if (errs.length) {
        errs.forEach(err => this.$toast.error(err))
        return; // abort API call if any validation failed
      }

      try {
        const { data } = await this.$axios.post("/notes/", {
          content: `# ${this.newNoteName}\n`,
          name: this.newNoteName,
          subject: this.mutSubject.slug,
          created: moment().toISOString(),
          last_modified: moment().toISOString()
        });
        this.$toast.success(
          `Note "${this.newNoteName}" créée`
        );
        this.$toast.show("Ouverture de la note...");
        this.$router.push(
          `/notes/${data.uuid}`
        );
      } catch (error) {
        this.$toast.error(`Erreur lors de la création de la note: ${error}`);
      }
    },
    pickSubject($event) {
      this.mutSubject = $event;
      document
        .getElementById("modal_add-note-subject-picker")
        .classList.remove("opened");
    }
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

/deep/ .modal-wrapper
  max-width: 80vw
  +mobile
    width: 80vw

.InputFlat
  margin-left: 10px
  width: calc(100% - 50px*2)
.ButtonFlat /deep/ .icon
  font-size: 40px
</style>