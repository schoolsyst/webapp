<template lang="pug">
//-COMPONENT TREE
  Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

  ArrayButtonFlat
  MainGroup
      MainGroupLeft
          HeadingSub

          HeadingSub

<div class="container">
  ModalAddNote(v-bind="{currentCourseSubject, newNoteName}")

  TheHeading Prises de notes

  ButtonFloating(icon="add", open-modal="add-note", open-at="self.bottom") Nouvelle note...
  MainGroup(full-size)
    template(v-if="currentCourse")
      HeadingSub {{currentCourse.subject.name}}
      ArrayCardNoteFile
        CardNoteFile(v-for="(note, i) in currentSubjectCards" :key="i" v-bind="note")

    HeadingSub(has-inline-buttons)
      span Tout
      ArrayButtonFlat(inline)
        InputFlat.search(
          icon="search"
          name="search"
          placeholder="Rechercher un fichier"
          v-model="searchText"
        )
        DropdownFlat(
          icon="sort"
          name="sort"
          :options="sortOptions"
          v-model="sortBy"
        ) Date de modification
    ArrayCardNoteFile
      CardNoteFile(
        v-for="(note, i) in allCards"
        :key="i"
        v-bind="note"
      )
</div>
</template>

<script>
import axios from "axios";
import slugify from "slugify";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import TheHeading from "~/components/TheHeading.vue";
import ArrayButtonFlat from "~/components/ArrayButtonFlat.vue";
import ButtonFlat from "~/components/ButtonFlat.vue";
import InputFlat from "~/components/InputFlat.vue";
import DropdownFlat from "~/components/DropdownFlat.vue";
import MainGroup from "~/components/MainGroup.vue";
import MainGroupLeft from "~/components/MainGroupLeft.vue";
import MainGroupRight from "~/components/MainGroupRight.vue";
import HeadingSub from "~/components/HeadingSub.vue";
import ArrayCardNoteFile from "~/components/ArrayCardNoteFile.vue";
import CardNoteFile from "~/components/CardNoteFile.vue";
import ButtonFloating from "~/components/ButtonFloating.vue";
import ModalAddNote from "~/components/ModalAddNote.vue";

export default {
  layout: "default",
  components: {
    TheHeading,
    ArrayButtonFlat,
    ButtonFlat,
    ButtonFloating,
    InputFlat,
    DropdownFlat,
    MainGroup,
    MainGroupLeft,
    MainGroupRight,
    HeadingSub,
    ArrayCardNoteFile,
    CardNoteFile,
    ModalAddNote
  },

  computed: {
    ...mapGetters({
      token: "auth/token"
    })
  },

  async asyncData({ store, app }) {
    try {
      const { data } = await app.$axios.get(`/notes/`);
      store.commit("notes/SET_NOTES", data);
    } catch (e) {
      console.error(e);
    }

    try {
      const { data } = await app.$axios.get(`/events/`);
      store.commit("schedule/SET_COURSES", data);
    } catch (error) {
      console.error(error);
    }
  },

  data() {
    return {
      // UI DATA
      searchText: "",
      sortOptions: [
        { value: "lastModified", name: "Date de modification" },
        { value: "created", name: "Date de création" },
        { value: "subject", name: "Matière" }
      ],
      sortBy: "lastModified",
      newNoteName: "",
      // API DATA
      cards: []
    };
  },

  computed: {
    ...mapGetters({
      currentCourse: "schedule/currentCourse",
      notes: "notes/allNotes"
    }),
    currentCourseSubject() {
      if (this.currentCourse) {
        return this.currentCourse.subject;
      } else {
        return {
          color: "#000000",
          name: "...",
          abbreviation: "...",
          slug: "..."
        };
      }
    },
    currentSubjectCards() {
      let notes = this.notes.filter(
        note => note.notion.subject.slug === this.currentCourse.subject.slug
      );
      let cards = [];
      for (const note of notes) {
        cards.push({
          title: note.name,
          detail: note[this.sortBy],
          filepath: note.filepath
        });
      }

      return cards;
    },
    allCards() {
      let notes = this.notes;
      if (this.currentCourse) {
        notes = notes.filter(
          note => note.subject.slug !== this.currentCourse.subject.slug
        );
      }
      let cards = [];
      for (const note of notes) {
        cards.push({
          title: note.name,
          detail: note[this.sortBy],
          filepath: note.filepath
        });
      }

      return cards;
    }
  },

  methods: {},

  mounted() {
    // can't seem to get @click working...
    document.querySelectorAll(".js-confirm-modal").forEach(e => {
      e.addEventListener("click", event => {
        event.preventDefault();
        this.addNote();
      });
    });
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'


/deep/ .InputFlat.search .icon
  transform: rotateY(.5turn)
</style>