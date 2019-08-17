<template>
  <!-- COMPONENT TREE
Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

ArrayButtonFlat
MainGroup
    MainGroupLeft
        HeadingSub

        HeadingSub
  -->

  <div class="container">
    <TheHeading>Prises de notes</TheHeading>
    <MainGroup full-size v-if="currentCourse">
      <HeadingSub>{{currentCourse.subject.name}}</HeadingSub>
      <ArrayCardNoteFile v-if="currentSubjectCards">
        <CardNoteFile v-for="(note, i) in currentSubjectCards" :key="i" v-bind="note" />
      </ArrayCardNoteFile>
      <HeadingSub has-inline-buttons>
        <span>Tout</span>
        <ArrayButtonFlat inline>
          <InputFlat
            icon="search"
            name="search"
            placeholder="Rechercher un fichier"
            v-model="searchText"
          ></InputFlat>
          <DropdownFlat
            icon="sort"
            name="sort"
            :options="sortOptions"
            v-model="sortBy"
          >Date de modification</DropdownFlat>
        </ArrayButtonFlat>
      </HeadingSub>
      <ArrayCardNoteFile v-if="allCards">
        <CardNoteFile v-for="(note, i) in allCards" :key="i" v-bind="note" />
      </ArrayCardNoteFile>
    </MainGroup>
  </div>
</template>

<script>
import axios from "axios";
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

export default {
  layout: "default",
  components: {
    TheHeading,
    ArrayButtonFlat,
    ButtonFlat,
    InputFlat,
    DropdownFlat,
    MainGroup,
    MainGroupLeft,
    MainGroupRight,
    HeadingSub,
    ArrayCardNoteFile,
    CardNoteFile
  },

  computed: {
    ...mapGetters({
      token: "auth/token"
    })
  },

  mounted() {
    console.log(this.token);
  },

  data() {
    return {
      searchText: "",
      sortOptions: [
        { value: "lastModified", name: "Date de modification" },
        { value: "created", name: "Date de création" },
        { value: "subject", name: "Matière" }
      ],
      sortBy: "lastModified",
      // API DATA ↓
      currentCourse: {
        id: 2,
        subject: {
          id: 7,
          user: 1,
          color: "#1A237E",
          name: "English",
          slug: "english",
          abbreviation: "eng"
        },
        start: "08:00:00",
        end: "08:55:00",
        room: "L216",
        day: "monday",
        weekType: "both"
      },
      notes: []
    };
  },

  computed: {
    currentSubjectCards: function() {
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
    allCards: function() {
      let notes = this.notes.filter(
        note => note.notion.subject.slug !== this.currentCourse.subject.slug
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
    }
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>