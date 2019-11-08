<template lang="pug">

<div class="container">
  ModalAddNote(:subject="courseOrPlaceholder(currentCourse).subject", :newNoteName="newNoteName")

  TheHeading Prises de notes

  ButtonFloating(icon="add", open-modal="add-note", open-at="self").new-note-fab Nouvelle note...
  MainGroup(full-size)
    template(v-if="currentCourse")
      HeadingSub {{courseOrPlaceholder(currentCourse).subject}}
      ArrayCardNoteFile
        CardNoteAdd
        CardNoteFile(v-for="(note, i) in currentSubjectCards" :key="i" v-bind="note")

    HeadingSub.all-notes(has-inline-buttons)
      span.heading-text(v-if="currentCourse") Tout
      ArrayButtonFlat(inline)
        //TODO: @keydown.enter open first note (when searchbox focused)
        InputFlat.search(
          icon="search"
          name="search"
          placeholder="Rechercher un fichier"
          v-model="searchText"
          maxlength="30"
        )
        DropdownFlat(
          icon="sort"
          name="sort"
          :options="sortOptions"
          v-model="sortBy",
          @input="sortBy = $event.target.value"
        )
    ArrayCardNoteFile
      CardNoteAdd(v-if="!currentCourse")
      CardNoteFile(
        v-for="(card, i) in searchedAndSortedCards"
        :key="i"
        v-bind="card"
      )
</div>
</template>

<script>
import axios from "axios"
import slugify from "slugify"
import moment from "moment"
import Fuse from "fuse.js"
import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
//------------------------------------------------------------------------
import TheHeading from "~/components/TheHeading.vue"
import ArrayButtonFlat from "~/components/ArrayButtonFlat.vue"
import ButtonFlat from "~/components/ButtonFlat.vue"
import InputFlat from "~/components/InputFlat.vue"
import DropdownFlat from "~/components/DropdownFlat.vue"
import MainGroup from "~/components/MainGroup.vue"
import MainGroupLeft from "~/components/MainGroupLeft.vue"
import MainGroupRight from "~/components/MainGroupRight.vue"
import HeadingSub from "~/components/HeadingSub.vue"
import ArrayCardNoteFile from "~/components/ArrayCardNoteFile.vue"
import CardNoteFile from "~/components/CardNoteFile.vue"
import ButtonFloating from "~/components/ButtonFloating.vue"
import ModalAddNote from "~/components/ModalAddNote.vue"
import CardNoteAdd from "~/components/CardNoteAdd.vue"

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
    CardNoteAdd,
  },

  data() {
    return {
      // UI Data
      searchText: "",
      sortOptions: [
        { value: "last_modified", name: "Date de modification" },
        { value: "created", name: "Date de création" },
        { value: "subject", name: "Matière" },
      ],
      sortBy: "last_modified",
      newNoteName: "",
      // API Data
      cards: [],
      fuse: null,
    }
  },

  fetch({ store }) {
    store.dispatch('schedule/load')
    store.dispatch('notes/load')
  },

  computed: {
    ...mapGetters({
      currentCourse: "schedule/currentCourse",
      notes: "notes/all",
    }),
    allCards() {
      let notes = this.notes
      if (this.currentCourse) {
        notes = notes.filter(
          (note) => note.subject.slug !== this.currentCourse.subject.slug
        )
      }
      let cards = this.notesToCards(notes)
      this.fuse = new Fuse(cards, {
        keys: ["name", "content", "subject.name"],
        id: "uuid",
        shouldSort: false,
        threshold: 0.2,
        maxPatternLength: 32,
      })
      return cards
    },
    currentSubjectCards() {
      return this.notesToCards(this.notes)
        .filter((card) => card.subject.slug === this.courseOrPlaceholder(this.currentCourse).subject.slug)
        .sort((a, b) =>
          moment(a.last_modified).isBefore(b.last_modified) ? 1 : -1
        )
    },
    searchedCards() {
      if (this.searchText) {
        let uuids = this.fuse.search(this.searchText)
        return this.allCards.filter((card) => uuids.includes(card.uuid))
      } else {
        return this.allCards
      }
    },
    searchedAndSortedCards() {
      return this.searchedCards.sort((a, b) =>
        moment(a[this.sortBy]).isBefore(b[this.sortBy]) ? 1 : -1
      )
    },
  },

  methods: {
    ...mapGetters('schedule', ['courseOrPlaceholder']),
    notesToCards(notes) {
      let cards = []
      for (const note of notes) {
        cards.push({
          ...note,
          detailKey: this.sortBy,
          detail: note[this.sortBy],
        })
      }

      let sortFunc
      switch (this.sortBy) {
        case "last_modified":
        case "created":
          sortFunc = (a, b) =>
            moment(a[this.sortBy]).isAfter(b[this.sortBy]) ? -1 : 1
          break
        case "subject":
          sortFunc = (a, b) => (a.subject.slug === b.subject.slug ? -1 : 1)
          break

        default:
          sortFunc = (a, b) => (a[this.sortBy] > b[this.sortBy] ? -1 : 1)
          break
      }
      return cards.sort(sortFunc)
    },
  },

  mounted() {
    // can't seem to get @click working...
    document.querySelectorAll(".js-confirm-modal").forEach((e) => {
      e.addEventListener("click", (event) => {
        event.preventDefault()
        this.addNote()
      })
    })
  },
}
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

+mobile
  .CardNoteAdd, .ButtonFloating.new-note-fab
    display: none
</style>
