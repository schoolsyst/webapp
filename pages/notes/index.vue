<template lang="pug">
  .container
    #loading(v-if="!loaded")
      p Chargement...
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
        li.card-new
          Icon add
        li(
          v-for="note in orderBy()(searched(currentSubject), sortBy)" :key="note.uuid"
          @contextmenu.prevent="$refs.menu.open($event, { note })"
        )
          CardNote(v-bind="note")
    .all(v-if="searched(all).length > 0")
      HeadingSub(v-if="currentCourse") Tout
      ul.notes
        li.card-new(v-if="!currentCourse")
          Icon add
        li(
          v-for="note in orderBy()(searched(all), sortBy)" :key="note.uuid" 
          @contextmenu.prevent="$refs.menu.open($event, { note })"
        )
          CardNote(v-bind="note" @more.prevent="$refs.menu.open($event, { note })")
    ScreenEmpty(v-else-if="!!searchQuery" @cta="newNote")
      template(#smiley) :/
      p Votre recherche n'a pas donné de résultat.
      template(#cta) Nouvelle note
    ScreenEmpty(v-else @cta="newNote")
      template(#smiley) oO
      p C'est plutôt vide ici.
      template(#cta) Créer une note
    
    
    vue-context(
      ref="menu" 
      :close-on-click="true" 
      :close-on-scroll="true"
    )
      template(slot-scope="child" v-if="child.data")
        li: nuxt-link(:to="`/notes/${child.data.note.uuid}`" target="_blank") #[Icon open_in_new] Ouvrir dans un nouvel onglet
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
import Icon from '~/components/Icon.vue'
import VueContext from 'vue-context'
import 'vue-context/src/sass/vue-context.scss'
import { mapGetters, mapActions } from 'vuex';
import Fuse from 'fuse.js'
export default {
  components: { HeadingSub, CardNote, InputField, Icon, VueContext, ButtonNormal, ScreenEmpty },
  data() {
    return {
      // User-editable data
      searchQuery: "",
      sortBy: 'added',
      // UI data
      sortOptions: [
        { value: 'modified', name: "Date de création" },
        { value: 'added',  name: "Date de modification" },
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
    searched(toFilter) {
      if (this.searchQuery) {
        let uuids = this.fuse.search(this.searchQuery)
        return toFilter.filter((o) => uuids.includes(o.uuid))
      } else {
        return toFilter
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('schedule/load')
    await this.$store.dispatch('notes/load')
    this.loaded = true
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
// LOADING SCREEN
#loading
  position fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  width 100vw
  height 100vh
  background white
  display flex
  text-align center
  justify-content center
  align-items center
  z-index 100
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
      width 200px
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
ul.notes
  list-style none
  flex-wrap wrap
  li
    margin-right 2rem
    margin-bottom 2rem
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
</style>
