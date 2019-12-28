<template lang="pug">
  .container
    //FIXME: create empty note -> change subject -> go back -> cancel deletion -> wrong subject (before changed) is used
    //FIXME: goto note editor -> rename -> go back -> changes not applied until refresh
    //TODO: Select multiple notes
    PickerSubject(@pick="newNote.subject = $event; create()")
    PickerSubject(@pick="editingNote.subject = $event; changeSubject()" namespace="change-subject")
    BaseModal(name="rename-note" title="Renommer une note")
      InputField(
        v-model="editingNote.mName"
        action-icon="replay" @action="editingNote.mName = null" :no-action-button="!editingNote.mName"
        :placeholder="editingNote.name"
        no-label no-error-messages variant="filled"
      )
      ButtonNormal(variant="primary" @click="rename(); $modal.hide('rename-note')") OK
    .toolbar(v-if="all.length")
      Icon.search-icon search
      InputField(
        v-model.lazy="searchQuery"
        no-label, no-error-messages
        placeholder="Recherche par titre ou nom de la matière"
      )
      Icon filter_list
      InputSelect(
        :options="subjects" v-model="filterSubject"
        placeholder="Choisir une matière"
      )
        template(slot="singleLabel" slot-scope="props")
          BadgeSubject(v-bind="props.option" variant="dot" no-tooltip)
          span.subject-name {{ props.option.name }}
        template(slot="option" slot-scope="props")
          BadgeSubject(v-bind="props.option" variant="dot" no-tooltip)
          span.subject-name {{ props.option.name }}
        template(slot="noOptions")
          p Aucun résultat.
      Icon sort
      InputSelect(
        :options="sortOptions" v-model="sortBy" 
        track-by="value" label="name" 
        placeholder="Trier par..."
      )
    ul.notes(v-if="searched(all).length")
        li.card-new(@click="create" @click.ctrl="create(true)")
          Icon add
        li(
          v-for="note in orderBy()(searched(all), sortBy.value)" :key="note.uuid" 
          @contextmenu.prevent="$refs.menu.open($event, { note })"
        )
          CardNote(v-bind="note" @more.prevent="$refs.menu.open($event, { note })")
    ScreenEmpty(v-else-if="searchQuery || filterSubject" @cta="create").no-search-results
      template(#smiley) :/
      p(v-if="searchQuery") Votre recherche n'a pas donné de résultat.
      p(v-else-if="filterSubject").
        Vous n'avez aucune note en 
        #[BadgeSubject(v-bind="filterSubject" variant="dot" no-tooltip inline)] 
        {{ filterSubject.name }}
  
      template(#cta) {{noResultsCtaText}}
    ScreenEmpty(v-else @cta="create" @cta-secondary="filterSubject = null").no-notes
      template(#smiley) oO
      p C'est plutôt vide ici.
      template(#cta) Créer une note
      template(#cta-secondary v-if="filterSubject") Afficher toutes les notes
    
    
    vue-context(
      ref="menu" 
      :close-on-click="true" 
      :close-on-scroll="true"
    )
      template(slot-scope="child" v-if="child.data")
        li: component(
            :is="child.data.note.format === 'LINK' ? 'a' : 'nuxt-link'" 
            :to="`/notes/${uuid}`" 
            :href="child.data.note.format === 'LINK' ? child.data.note.content : `/notes/${child.data.note.uuid}`"
            target="_blank"
          )
            | #[Icon open_in_new] Ouvrir dans un nouvel onglet
        li: a(@click.prevent="openRenameModal(child.data)") 
          Icon edit
          | Renommer
        li: a(@click.prevent="editingNote = {...editingNote, ...child.data.note}; $modal.show('change-subject-subject-picker')") 
          Icon bookmark_border
          | Changer la matière
        li: a(@click.prevent="del({uuid: child.data.note.uuid})") 
          Icon delete
          | Supprimer

</template>

<script>
import ScreenEmpty from '~/components/ScreenEmpty.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import BaseModal from '~/components/BaseModal.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import InputField from '~/components/InputField.vue'
import InputSelect from '~/components/InputSelect.vue'
import CardNote from '~/components/CardNote.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import Icon from '~/components/Icon.vue'
import VueContext from 'vue-context'
import 'vue-context/src/sass/vue-context.scss'
import { mapGetters, mapActions, mapState } from 'vuex';
import Fuse from 'fuse.js'
export default {
  components: { HeadingSub, CardNote, InputField, Icon, BaseModal, VueContext, ButtonNormal, ScreenEmpty, PickerSubject, VueContext, InputSelect, BadgeSubject },
  head: {
    title: 'Cours'
  },
  data() {
    return {
      // User-editable data
      searchQuery: "",
      sortBy: 'opened',
      filterSubject: null,
      newNote: {
        subject: null,
        name: null,
        content: '',
        format: 'HTML',
        modified: null,
        added: null,
        opened: null
      },
      editingNote: {
        uuid: null,
        subject: null,
        name: null,
        mName: null
      },
      // UI data
      sortOptions: [
        { value: 'opened',    name: 'Dernière ouverture' },
        { value: 'added',     name: "Création" },
        { value: 'modified',  name: "Dernière modification" },
      ],
      openedContextMenuNote: null,
      // API Data
      loaded: false,
      // Fuse.js
      fuse: null
    }
  },
  computed: {
    ...mapGetters('notes', ['all', 'one']),
    ...mapGetters('schedule', ['currentCourse']),
    ...mapGetters({
      subjects: 'subjects/all'
    }),
    noResultsCtaText() {
      if (!this.filterSubject) return "Nouvelle note"
      const name = this.filterSubject.name
      const vowels = 'aeuioy'.split('')
      let significantLetter = name.split('')[0]
      if (significantLetter === 'h') significantLetter = name.split('')[1]
      const startsWithVowel = vowels.includes(significantLetter.toLowerCase())
      return (
        "Nouvelle note " 
        + (startsWithVowel ? "d'" : "de ") 
        + this.lowercaseSubject()(this.filterSubject.uuid)
      )
    },
  },
  methods: {
    ...mapGetters('notes', ['orderBy']),
    ...mapActions('notes', {del: 'delete'}),
    ...mapActions('notes', ['post']),
    ...mapGetters({
      lowercaseSubject: 'subjects/lowercaseName'
    }),
    searched(notes) {
      if (this.searchQuery) {
        let uuids = this.fuse.search(this.searchQuery)
        notes = notes.filter((o) => uuids.includes(o.uuid))
      }
      if (this.filterSubject) {
        notes = notes.filter((o) => o.subject.uuid === this.filterSubject.uuid)
      }
      return notes
    },
    async create(forceSelectSubject = false) {
      // --- Get the subject ---
      /* If we are currently in a course, get the subject from it.
       * If the option forceSelectSubject is true, ignore this.
       */
      if (this.filterSubject !== null && !forceSelectSubject) {
        this.newNote.subject = this.filterSubject
      /* Else, if the newNote's subject isn't set, ask the user 
       * and stop the function (since we can't create a note w/o a subject)
       */
      } else if (this.newNote.subject === null) {
        this.$modal.show('subject-picker')
        return
      }
      const createdNote = await this.$store.dispatch('notes/post', { note: this.newNote })
      this.$router.push(`/notes/${createdNote.uuid}`)
    },
    async changeSubject() {
      const { uuid, suject } = this.editingNote
      await this.$store.dispatch('notes/patch', { uuid, modifications: { subject }})
      this.$toast.success("Matière modifiée", { icon: 'check' })
    },
    async rename() {
      const { uuid, mName } = this.editingNote
      await this.$store.dispatch('notes/patch', { uuid, modifications: { name: mName }})

      this.$toast.success("Note renommée", { icon: 'check' })
    },
    openRenameModal({note}) {
      this.editingNote = {...this.editingNote, ...note, mName: null }
      this.$modal.show('rename-note')
    }
  },
  async mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('schedule/load')
      await this.$store.dispatch('notes/load')
    }, { title: "Triage des classeurs" })
    // Init fuse
    this.fuse = new Fuse(this.all, {
      keys: ["name", "subject.name"],
      id: "uuid",
      shouldSort: false,
      threshold: 0.2,
      maxPatternLength: 64,
      minMatchCharLength: 3,
    })
    // Default value for separateGroupSubject
    this.filterSubject = this.currentCourse ? this.currentCourse.subject : null
  }
}
</script>

<style lang="stylus" scoped>
//-----------------------
//       TOOLBAR
//-----------------------
.toolbar
  margin-bottom 2rem
  margin-left 2rem
  display flex
  align-items center
  i
    margin-right: 0.5rem
    font-size 1.75rem
    &:not(:first-child)
      margin-left 1.5rem
    &.search-icon
      transform rotate(90deg)
  /deep/ input, .multiselect
    height 2.75rem
  .multiselect
    width 15rem
  /deep/ input
    width 30rem
  
// .search
//   display flex
//   align-items center
//   justify-content center
//   margin-bottom 3rem
//   width 100%
//   i
//     font-size 2.5em
//     margin-right 0.5rem
//     transform rotate(90deg)
//   & /deep/ input
//     width 500px
//     @media (max-width 600px)
//       width 80vw
//   @media (max-width 375px)
//     i
//       display none

// .v-context li:hover
//     &, a
//       background var(--blue-offset)
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
  margin-left 2rem
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
  background var(--blue-offset)
  color var(--blue)
  i
    font-size 5rem
  justify-content center
  align-items center
  border-radius var(--border-radius)
  &:hover
    color var(--blue-dark)
    background var(--blue-offset-dark)
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
//-----------------------
//      RENAME MODAL
//-----------------------
#modal_rename-note /deep/ .modal-wrapper .content
  display flex
  align-items center
</style>
