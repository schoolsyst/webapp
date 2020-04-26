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
    .toolbar(v-if="all.length || filterSubject")
      .field-wrapper
        Icon.search-icon search
        InputField(
          v-model.lazy="searchQuery"
          no-label, no-error-messages
          placeholder="Recherche par titre ou nom de la matière"
        )
      .field-wrapper
        Icon filter_list
        InputSelectSubject(
          v-model="filterSubject"
          name="filter"
        )
      .field-wrapper
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
          CardNote(
            v-bind="note"
            @more.stop="$refs.menu.open($event, { note })"
          )
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
            :to="`/notes/${child.data.note.uuid}`" 
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
import VueContext from 'vue-context'
import 'vue-context/src/sass/vue-context.scss'
import { mapGetters, mapActions } from 'vuex'
import Fuse from 'fuse.js'
import ScreenEmpty from '~/components/ScreenEmpty.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import BaseModal from '~/components/BaseModal.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import InputField from '~/components/InputField.vue'
import InputSelect from '~/components/InputSelect.vue'
import InputSelectSubject from '~/components/InputSelectSubject.vue'
import CardNote from '~/components/CardNote.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import Icon from '~/components/Icon.vue'
export default {
  components: {
    HeadingSub,
    CardNote,
    InputField,
    Icon,
    BaseModal,
    VueContext,
    ButtonNormal,
    ScreenEmpty,
    PickerSubject,
    InputSelect,
    BadgeSubject,
    InputSelectSubject,
  },
  head: {
    title: 'Cours',
  },
  data() {
    return {
      // User-editable data
      searchQuery: '',
      sortBy: 'opened',
      filterSubject: null,
      newNote: {
        subject: null,
        name: null,
        content: '',
        format: 'HTML',
        modified: null,
        added: null,
        opened: null,
      },
      editingNote: {
        uuid: null,
        subject: null,
        name: null,
        mName: null,
      },
      // UI data
      sortOptions: [
        { value: 'opened', name: 'Ouverture' },
        { value: 'added', name: 'Création' },
        { value: 'modified', name: 'Modification' },
      ],
      openedContextMenuNote: null,
      // API Data
      loaded: false,
      // Fuse.js
      fuse: null,
    }
  },
  computed: {
    ...mapGetters('notes', ['all', 'one']),
    ...mapGetters('schedule', ['currentCourse']),
    ...mapGetters({
      subjects: 'subjects/all',
    }),
    noResultsCtaText() {
      if (!this.filterSubject) return 'Nouvelle note'
      const name = this.filterSubject.name
      const vowels = 'aeuioy'.split('')
      let significantLetter = name.split('')[0]
      if (significantLetter === 'h') significantLetter = name.split('')[1]
      const startsWithVowel = vowels.includes(significantLetter.toLowerCase())
      return (
        'Nouvelle note ' +
        (startsWithVowel ? "d'" : 'de ') +
        this.lowercaseSubject()(this.filterSubject.uuid)
      )
    },
  },
  mounted() {
    this.$withLoadingScreen(
      async () => {
        await this.$store.dispatch('schedule/load')
        await this.$store.dispatch('notes/load', true)
      },
      { title: 'Triage des classeurs' }
    )
    // Init fuse
    this.fuse = new Fuse(this.all, {
      keys: ['name', 'subject.name'],
      id: 'uuid',
      shouldSort: false,
      threshold: 0.2,
      maxPatternLength: 64,
    })
    // Default value for separateGroupSubject
    this.filterSubject = this.currentCourse ? this.currentCourse.subject : null
  },
  methods: {
    ...mapGetters('notes', ['orderBy']),
    ...mapActions('notes', { del: 'delete' }),
    ...mapActions('notes', ['post']),
    ...mapGetters({
      lowercaseSubject: 'subjects/lowercaseName',
    }),
    searched(notes) {
      if (this.searchQuery) {
        const uuids = this.fuse.search(this.searchQuery)
        notes = notes.filter(o => uuids.includes(o.uuid))
      }
      if (this.filterSubject) {
        notes = notes.filter(o => o.subject.uuid === this.filterSubject.uuid)
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
      const createdNote = await this.$store.dispatch('notes/post', {
        note: this.newNote,
      })
      this.$router.push(`/notes/${createdNote.uuid}`)
    },
    async changeSubject() {
      // eslint-disable-next-line
      const { uuid, suject } = this.editingNote
      await this.$store.dispatch('notes/patch', {
        uuid,
        // eslint-disable-next-line
        modifications: { subject },
      })
      this.$toast.success('Matière modifiée', { icon: 'check' })
    },
    async rename() {
      const { uuid, mName } = this.editingNote
      await this.$store.dispatch('notes/patch', {
        uuid,
        modifications: { name: mName },
      })

      this.$toast.success('Note renommée', { icon: 'check' })
    },
    openRenameModal({ note }) {
      this.editingNote = { ...this.editingNote, ...note, mName: null }
      this.$modal.show('rename-note')
    },
  },
}
</script>

<style lang="stylus" scoped>
//-----------------------
//TOOLBAR
//-----------------------
.toolbar
  display flex
  align-items center
  margin-bottom 2rem
  margin-left 2rem

  i
    margin-right 0.5rem
    font-size 1.5rem

    &:not(:first-child)
      margin-left 1.2rem

    &.search-icon
      transform rotate(90deg)

  /deep/ input, .multiselect
    height 2.75rem

  .multiselect
    max-width 80vw
    width 13rem

  /deep/ input
    max-width 80vw
    width 22rem

  .field-wrapper
    display flex
    align-items center

    &:not(:last-child)
      margin-right 1.5rem

  @media (max-width: 1100px)
    flex-wrap wrap
    justify-content flex-start
    align-items flex-start

    .field-wrapper:not(:last-child)
      margin-right 0
      margin-bottom 1rem

  @media (max-width: 650px)
    flex-direction column
    align-items center

//.search
//display flex
//align-items center
//justify-content center
//margin-bottom 3rem
//width 100%
//i
//font-size 2.5em
//margin-right 0.5rem
//transform rotate(90deg)
//& /deep/ input
//width 500px
//@media (max-width 600px)
//width 80vw
//@media (max-width 375px)
//i
//display none

//.v-context li:hover
//&, a
//background var(--blue-offset)
//a, i
//color var(--blue)
//-----------------------
//CARD LIST
//-----------------------
.HeadingSub
  margin-top 3rem
  margin-bottom 1rem

.all, .current-subject
  flex-direction column

ul.notes, .all, .current-subject
  display flex
  margin-left 2rem
  width 85vw

  @media (max-width: 600px)
    margin-left 0
    width 100%

    ul.notes li
      margin 0

ul.notes
  flex-wrap wrap
  list-style none

  @media (min-width: 600px)
    li
      margin-right 1.5rem
      margin-bottom 1.5rem

  @media (max-width: 600px)
    li
      width 50%

  @media (max-width: 350px)
    li
      width 100%

//-----------------------
//CARD
//-----------------------
.card, .card-new
  display flex
  flex-direction column
  width 225px
  height 310px
  transition all 0.25s ease

.card-new
  background var(--blue-offset)
  color var(--blue)
  cursor pointer

  i
    font-size 5rem

  justify-content center
  align-items center
  border-radius var(--border-radius)

  &:hover
    background var(--blue-offset-dark)
    color var(--blue-dark)

  @media (max-width: 600px)
    width 50%
    //border solid 1px var(--grey)
    border-radius 0

  @media (max-width: 350px)
    width 100vw

//-----------------------
//SCREEN EMPTY: NO SEARCH RESULTS
//-----------------------
.no-search-results /deep/
  min-height calc(100vh - 200px) !important

//-----------------------
//RENAME MODAL
//-----------------------
#modal_rename-note /deep/ .modal-wrapper .content
  display flex
  align-items center
</style>
