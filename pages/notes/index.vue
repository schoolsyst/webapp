<template lang="pug">
//-COMPONENT TREE
  Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

  ArrayButtonFlat
  MainGroup
      MainGroupLeft
          HeadingSub

          HeadingSub

<div class="container">
  ModalAddNote(:subject="currentCourseSubject", :newNoteName="newNoteName")

  TheHeading Prises de notes

  ButtonFloating(icon="add", open-modal="add-note", open-at="self") Nouvelle note...
  MainGroup(full-size)
    template(v-if="currentCourse")
      HeadingSub {{currentCourse.subject.name}}
      ArrayCardNoteFile
        CardNoteAdd(open-modal="add-note" open-at="self")
        CardNoteFile(v-for="(note, i) in currentSubjectCards" :key="i" v-bind="note")

    HeadingSub.all-notes(has-inline-buttons)
      span.heading-text(v-if="currentCourse") Tout
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
          v-model="sortBy",
          @input="sortBy = $event.target.value"
        ) Date de modification
    ArrayCardNoteFile
      CardNoteFile(
        v-for="(card, i) in allCards"
        :key="i"
        v-bind="card"
      )
</div>
</template>

<script>
import axios from "axios";
import slugify from "slugify";
import moment from 'moment';
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
import CardNoteAdd from '~/components/CardNoteAdd.vue'

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
    ModalAddNote,
    CardNoteAdd
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

    if (!store.getters['schedule/allEvents'].length) {
      try {
        const { data } = await app.$axios.get(`/events/`);
        store.commit("schedule/SET_EVENTS", data);
      } catch (error) {
        console.error(error);
      }
    }

    if (!store.getters.allSettings.length) {
      try {
        const { data } = await app.$axios.get('/settings/')
        store.commit('SET_SETTINGS', data)
      } catch (error) {
        console.error(error)
      }
    }
  },


  data() {
    return {
      // UI DATA
      searchText: "",
      sortOptions: [
        { value: "last_modified", name: "Date de modification" },
        { value: "created", name: "Date de création" },
        { value: "subject", name: "Matière" }
      ],
      sortBy: "last_modified",
      newNoteName: "",
      // API DATA
      cards: []
    };
  },

  computed: {
    ...mapGetters({
      currentCourse: "schedule/currentCourse",
      notes: "notes/allNotes",
      currentCourseSubject: 'schedule/currentCourseSubject'
    }),
    allCards() {
      let notes = this.notes;
      if (this.currentCourse) {
        notes = notes.filter(
          note => note.subject.slug !== this.currentCourse.subject.slug
        );
      }
      return this.notesToCards(notes)
      
    },
    currentSubjectCards() {
      return this.notesToCards(this.notes).filter(card => card.subject.slug === this.currentCourseSubject.slug)
    },
  },

  methods: {
    notesToCards(notes) {
      let cards = [];
      for (const note of notes) {
        cards.push({
          ...note,
          detailKey: this.sortBy,
          detail: note[this.sortBy]
        });
      }

      let sortFunc
      switch (this.sortBy) {
        case 'last_modified':
        case 'created':
          sortFunc = (a, b) => moment(a[this.sortBy]).isAfter(b._last_modified) ? -1 : 1
          break;
        case 'subject':
          sortFunc = (a, b) => a.subject.slug === b.subject.slug ? -1 : 1
          break;
      
        default:
          sortFunc = (a, b) => a[this.sortBy] > b[this.sortBy] ? -1 : 1
          break;
      }
      return cards.sort(sortFunc);
    }
  },

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

// /deep/ .confirm-modal label.icon
//   font-size: 50px
// /deep/ .BaseModal .modal-wrapper
//   position: fixed
//   right: calc(50px + 5px)
//   bottom: calc(50px + 5px)
//   width: 600px
//   display: grid
//   grid-template-columns: 40px calc(600px - 20px * 2 - 50px - 40px - 5px) 50px !important

/deep/ .InputFlat.search .icon
  transform: rotateY(.5turn)

.all-notes
  .ArrayButtonFlat
    padding-left: 0
  .heading-text
    padding-right: 20px
</style>