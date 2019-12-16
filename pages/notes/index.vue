<template lang="pug">
  .container
    PickerSubject(@pick="newNote.subject = $event; create()")
    .search(v-if="!!all.length")
      Icon search
      InputField(
        v-model.lazy="searchQuery"
        no-label
        no-error-messages
        placeholder="Recherche par titre ou nom de la matière"
      )
    .current-subject(v-if="currentCourse && !!searched(all).length")
      HeadingSub {{ currentCourse.subject.name }}
      ul.notes
        li.card-new(@click="create")
          Icon add
        li(
          v-for="note in orderBy()(searched(currentSubject), sortBy)" :key="note.uuid"
          @contextmenu.prevent="$refs.menu.open($event, { note })"
        )
          CardNote(v-bind="note")
    .all(v-if="searched(all).length > 0")
      HeadingSub(v-if="currentCourse") Tout
      ul.notes
        li.card-new(v-if="!currentCourse" @click="create")
          Icon add
        li(
          v-for="note in orderBy()(searched(all), sortBy)" :key="note.uuid" 
          @contextmenu.prevent="$refs.menu.open($event, { note })"
        )
          CardNote(v-bind="note" @more.prevent="$refs.menu.open($event, { note })")
    ScreenEmpty(v-else-if="!!searchQuery" @cta="create").no-search-results
      template(#smiley) :/
      p Votre recherche n'a pas donné de résultat.
      template(#cta) Nouvelle note
    ScreenEmpty(v-else @cta="create").no-notes
      template(#smiley) oO
      p C'est plutôt vide ici.
      template(#cta) Créer une note
    
    
    vue-context(
      ref="menu" 
      :close-on-click="true" 
      :close-on-scroll="true"
    )
      template(slot-scope="child" v-if="child.data")
        li
          component(
            :is="child.data.note.format === 'LINK' ? 'a' : 'nuxt-link'" 
            :to="`/notes/${uuid}`" 
            :href="child.data.note.format === 'LINK' ? child.data.note.content : `/notes/${child.data.note.uuid}`"
            target="_blank"
          )
            Icon open_in_new 
            | Ouvrir dans un nouvel onglet
        //- li: a(@click.prevent="ctxRename") #[Icon edit] Renommer
        //- li: a(@click.prevent="ctxChSubj") #[Icon bookmark_border] Changer la matière
        li: a(@click.prevent="del(child.data.note.uuid)") #[Icon delete] Supprimer

</template>

<script>
import ScreenEmpty from '~/components/ScreenEmpty.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import SubjectDot from '~/components/SubjectDot.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import InputField from '~/components/InputField.vue'
import CardNote from '~/components/CardNote.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import Icon from '~/components/Icon.vue'
import VueContext from 'vue-context'
import 'vue-context/src/sass/vue-context.scss'
import { mapGetters, mapActions } from 'vuex';
import Fuse from 'fuse.js'
export default {
  components: { HeadingSub, CardNote, InputField, Icon, VueContext, ButtonNormal, ScreenEmpty, PickerSubject },
  head: {
    title: 'Cours'
  },
  data() {
    return {
      // User-editable data
      searchQuery: "",
      sortBy: 'added',
      newNote: {
        subject: null,
        name: null,
        content: '',
        format: 'HTML',
        modified: null,
        added: null,
        opened: null
      },
      // UI data
      sortOptions: [
        { value: 'modified', name: "Date de création" },
        { value: 'added',    name: "Date de modification" },
        { value: 'subject',  name: "Matière" }
      ],
      openedContextMenuNote: null,
      // API Data
      loaded: false,
      // Fuse.js
      fuse: null
    }
  },
  computed: {
    ...mapGetters('notes', ['all']),
    ...mapGetters('schedule', ['currentCourse']),
    currentSubject() {
      if (this.currentCourse === null) return []
      return this.all.filter((o) => o.subject.uuid === this.currentCourse.subject.uuid)
    }
    },
  methods: {
    ...mapGetters('notes', ['orderBy']),
    ...mapActions('notes', {del: 'delete'}),
    ...mapActions('notes', ['post']),
    searched(toFilter) {
      if (this.searchQuery) {
        let uuids = this.fuse.search(this.searchQuery)
        return toFilter.filter((o) => uuids.includes(o.uuid))
      } else {
        return toFilter
      }
    },
    async create() {
      // --- Get the subject ---
      // If newNote.subject already exists, a subject has been chosen. Use it.
      if (this.newNote.subject !== null) {
        // (nothing to do, we can skip to the call to the post vuex action)
      // If we are currently in a course, get the subject from it.
      } else if (this.currentCourse !== null) {
        this.newNote.subject = this.currentCourse.subject
      // Else, ask the user and stop the function (since we can't create a note w/o a subject)
      } else {
        this.$modal.show('subject-picker')
        return
      }
      const createdNote = await this.$store.dispatch('notes/post', { note: this.newNote })
      this.$router.push(`/notes/${createdNote.uuid}`)
    }
  },
  async mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('schedule/load')
      await this.$store.dispatch('notes/load')
    }, { title: "Triage des classeurs" })
    this.fuse = new Fuse(this.all, {
      keys: ["name", "subject.name"],
      id: "uuid",
      shouldSort: false,
      threshold: 0.2,
      maxPatternLength: 64,
      minMatchCharLength: 3,
    })
  }
}
</script>

<style lang="stylus" scoped>
// SEARCH BAR
.search
  display flex
  align-items center
  justify-content center
  margin-bottom 3rem
  width 100%
  i
    font-size 2.5rem
    margin-right 0.5rem
    transform rotate(90deg)
  & /deep/ input
    width 500px
    @media (max-width 600px)
      width 80vw
  @media (max-width 375px)
    i
      display none

// CONTEXT MENU
.v-context li
  a
    display flex
    align-items center
  i
    margin-right 0.5rem
// .v-context li:hover
//     &, a
//       background var(--offset-blue)
//     a, i
//       color var(--blue)
//-----------------------
//       CARD LIST
//-----------------------
.HeadingSub
  margin-bottom 1rem
  margin-top 3rem
.all, .current-subject
  flex-direction column
ul.notes
.all, .current-subject
  margin: 0 auto
  display flex
  width 85vw
  @media (max-width 600px)
    width 100vw
    ul.notes li 
      margin: 0
ul.notes
  list-style none
  flex-wrap wrap
  li
    margin-right 1.5rem
    margin-bottom 1.5rem
//-----------------------
//         CARD
//-----------------------
.card
.card-new
  height: 310px
  width: 225px
  display flex
  flex-direction column
  transition all 0.25s ease
.card-new
  cursor pointer
  background var(--offset-blue)
  color var(--blue)
  i
    font-size 5rem
  justify-content center
  align-items center
  border-radius var(--border-radius)
  &:hover
    color var(--blue-dark)
    background var(--offset-blue-dark)
  @media (max-width 600px)
    width 50vw
    // border solid 1px var(--grey)
    border-radius 0
  @media (max-width: 350px)
    width 100vw
//-----------------------
// SCREEN EMPTY: NO SEARCH RESULTS
//-----------------------
.no-search-results /deep/
  min-height calc(100vh - 200px) !important
</style>
