<template lang="pug">
    .container
        ModalNoteDownload(:note="{uuid, format, name}")
        PickerSubject(@pick="subject = $event")
        button.show-bottom-bar(@click="bottomBarHidden = false"): Icon(v-tooltip="'Montrer'") keyboard_arrow_up
        TheBottomBar(:shown="!bottomBarHidden")
            ul.time
                li {{ format(now, 'HH:mm') }}
            ul.stats
                li(v-if="textDurations" v-tooltip="textDurationsTooltip")
                    span.value {{ textDurations.reading }}
                    |  Lecture
                li(v-if="counts" v-tooltip.top-start="allCountsTooltip")
                    span.value {{ counts.words }}
                    |  Mots
                li: button(@click="bottomBarHidden = true"): Icon(v-tooltip="'Masquer'") keyboard_arrow_down
        .toolbar
            .top
                nuxt-link(to="/notes"): Icon.icon arrow_back
                .title
                    BadgeSubject.subject(
                        v-bind="subject" 
                        @click="$modal.show('subject-picker')"
                        clickable, thin, no-tooltip
                        v-tooltip="'Changer la matière'"
                    )
                    input.title-field(
                        placeholder="Document sans titre"
                        v-model="name"
                        @blur="updateName"
                        name="name"
                        type="text"
                    )
                    a.unsaved-work(
                        v-show="unsavedWork" 
                        v-tooltip.bottom="'Modifications non sauvegardées'"
                        @click="save({toast: true})"
                    ) &bull;

            EditorMenuBar(:editor="editor" v-slot="{commands, isActive}")
                .menubar
                    button.mobile(@click="$modal.show('edit-properties')" v-tooltip.bottom="'Propriétés de la note...'")
                        Icon settings
                    button(@click="commands.undo" v-tooltip.bottom="'Annuler<br/><kbd>Ctrl</kbd> + <kbd>Z</kbd>'")
                        Icon undo
                    button(@click="commands.redo" v-tooltip.bottom="'Refaire<br/><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>'")
                        Icon redo
                    span.sep |
                    //- The key shortcut listener for Ctrl + S is managed with a manual event listener.
                    //- See: https://stackoverflow.com/a/55323073
                    button(
                        @click="save({toast: true})"
                        v-tooltip.bottom="'Sauvegarder<br/><kbd>Ctrl</kbd> + <kbd>S</kbd>'"
                    )
                        Icon(filled) save
                    button.mobile(v-tooltip.bottom="'Télécharger en...<br/><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>'" @click="$modal.show('download-note')")
                        Icon(filled) save_alt
                    //- button
                    //-     Icon share
                    //-     | Partager
                    button.mobile(v-tooltip.bottom="'Imprimmer<br/><kbd>Ctrl</kbd> + <kbd>P</kbd>'")
                        Icon(filled) print
                    button Réviser...
                    span.sep |
                    button(v-tooltip.bottom="'Enlever le formatage<br/><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>:</kbd>'")
                        Icon format_clear
                    InputSelect.headings-dropdown(
                        @input="\
                            $event === 0 \
                            ? commands.paragraph \
                            : commands.heading({level: headingLevelNames.indexOf(props.option)})\
                        "
                        :value="\
                            isActive.heading({level: 1}) ? 1 : (\
                            isActive.heading({level: 2}) ? 2 : (\
                            isActive.heading({level: 3}) ? 3 : (\
                            isActive.heading({level: 4}) ? 4 : (\
                            isActive.heading({level: 5}) ? 5 : (\
                            isActive.heading({level: 6}) ? 6 : 0\
                        )))))"
                        :options="headingLevelNames"
                        :searchable="false"
                        :show-labels="false"
                        placeholder="Titre..."
                        :custom-label="(level) => headingLevelNames[level]"
                    )
                        template(slot="option", slot-scope="props")
                            component.heading-item(:is="headingLevelNames.indexOf(props.option) <= 0 ? 'p' : 'h' + headingLevelNames.indexOf(props.option)") {{props.option}}

                    span.sep |
                    button(
                        :class="{active: isActive.bold()}"
                        @click="commands.bold"
                        v-tooltip.bottom="'Gras<br/><kbd>Ctrl</kbd> + <kbd>B</kbd>'"
                    )
                        Icon format_bold
                    button(
                        :class="{active: isActive.italic()}"
                        @click="commands.italic"
                        v-tooltip.bottom="'Italique<br/><kbd>Ctrl</kbd> + <kbd>I</kbd>'"
                    )
                        Icon format_italic
                    button(
                        :class="{active: isActive.underline()}"
                        @click="commands.underline"
                        v-tooltip.bottom="'Souligné<br/><kbd>Ctrl</kbd> + <kbd>U</kbd>'"
                    )
                        Icon format_underlined
                    button(
                        :class="{active: isActive.strike()}"
                        @click="commands.strike"
                        v-tooltip.bottom="'Barré<br/><kbd>Ctrl</kbd> + <kbd>D</kbd>'"
                    )
                        Icon format_strikethrough
                    button(
                        :class="{active: isActive.math()}"
                        @click="commands.math"
                        v-tooltip.bottom="'Maths<br/><kbd>Ctrl</kbd> + <kbd>E</kbd>'"
                    ): math: mi x
                    button(
                        :class="{active: isActive.code()}"
                        @click="commands.code"
                        title=""
                    )
                        code M
                    button(
                        :class="{active: isActive.superscript()}"
                        @click="commands.superscript"
                        v-tooltip.bottom="'Superscript<br/><kbd>Ctrl</kbd> + <kbd>;</kbd>'"
                    )
                        span.low-opacity a
                        sup n
                    button(
                        :class="{active: isActive.subscript()}"
                        @click="commands.subscript"
                        v-tooltip.bottom="'Indice<br/><kbd>Ctrl</kbd> + <kbd>,</kbd>'"
                    )
                        span.low-opacity a
                        sub n
                    button(v-tooltip.bottom="'Couleur de texte'" @click="$modal.show('text-color')")
                        Icon(filled) format_color_text
                    button(
                        :class="{active: isActive.marker()}"
                        @click="commands.marker"
                        v-tooltip.bottom="'Surligné'"
                    )
                        Icon(filled) border_color
                    span.sep |
                    button(v-tooltip.bottom="'Note de bas de page<br/><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd>'")
                        | Note#[sup 1]
                    button(v-tooltip.bottom="'Lien<br/><kbd>Ctrl</kbd> + <kbd>K</kbd>'")
                        Icon insert_link
                    button(
                        @click="commands.bullet_list"
                        v-tooltip.bottom="'Liste à points<br/><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>8</kbd>'"
                    )
                        Icon format_list_bulleted
                    button(
                        @click="commands.ordered_list"
                        v-tooltip.bottom="'Liste numérotée<br/><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>9</kbd>'"
                    )
                        Icon format_list_numbered
                    button(v-tooltip.bottom="'Liste de définitions<br/><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>0</kbd>'")
                        | Def:
                    button(v-tooltip.bottom="'Abbréviation<br/><kbd>Ctrl</kbd> + <kbd>*</kbd>'")
                        | abbr
                    span.sep |
                    button(
                        @click="commands.horizontal_rule"
                        v-tooltip.bottom="'Ligne horizontale'"
                    ) 
                        | —
                    button(
                        :class="{active: isActive.table()}"
                        @click="commands.createTable({rowsCount: 2, colsCount: 2})"
                        v-tooltip.bottom="'Tableau'"
                    )
                        Icon table_chart
                    //- button(@click="commands.blockquote")
                    //-     Icon format_quote
                    //dropdown: Admonitions (Ctrl + !)
                    button(@click="commands.code_block" v-tooltip.bottom="'Bloc de code'")
                        Icon code
                    button(@click="commands.mathblock" v-tooltip.bottom="'Bloc de maths<br/><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>E</kbd>'"): Icon functions
                    button(v-tooltip.bottom="'Image'"): Icon image
                    button(@click="commands.addRowAfter") add row after

        .editor-page-wrapper
            editor-content.editor-page(:editor="editor")
        script(src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=AM_CHTML,Safe" async)
        script.
            document.querySelectorAll('.asciimath').forEach(el => {
                el.addEventListener('click', (event) => {
                    MathJax.Hub.Queue(['Typeset', MathJax.Hub, el])
                })
            })
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Countable from 'countable'
import { format } from 'date-fns'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  Image,
  ListItem,
  Mention,
  OrderedList,
  Table,
  TableHeader,
  TableCell,
  Code,
  TableRow,
  Bold,
  TodoItem,
  Italic,
  TodoList,
  Link,
  History,
  Strike,
  BulletList,
  Underline,
} from 'tiptap-extensions'
import debounce from 'lodash.debounce'
import ModalNoteDownload from '~/components/ModalNoteDownload.vue'
import Superscript from '~/plugins/tiptap-extensions/Superscript'
import MathBlock from '~/plugins/tiptap-extensions/MathBlock'
import MathInline from '~/plugins/tiptap-extensions/MathInline'
import Marker from '~/plugins/tiptap-extensions/Marker'
import Subscript from '~/plugins/tiptap-extensions/Subscript'
import Icon from '~/components/Icon.vue'
import InputField from '~/components/InputField.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import InputSelect from '~/components/InputSelect.vue'
import TheBottomBar from '~/components/TheBottomBar.vue'

export default {
  components: {
    Editor,
    InputField,
    EditorContent,
    EditorMenuBar,
    Icon,
    BadgeSubject,
    PickerSubject,
    InputSelect,
    TheBottomBar,
    ModalNoteDownload,
  },
  layout: 'bare',
  data() {
    return {
      bottomBarHidden: false,
      headingLevelNames: [
        'Corps',
        'Titre',
        'Partie',
        'Sous-partie',
        'Sous-sous-partie',
      ],
      editor: new Editor({
        extensions: [
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3, 4, 5, 6] }),
          new HorizontalRule(),
          new Image(),
          new ListItem(),
          new Mention(),
          new OrderedList(),
          new Table(),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
          new History(),
          new BulletList(),
          new MathBlock(),
          new MathInline(),
          new Marker(),
          new Subscript(),
          new Superscript(),
        ],
        content: ``,
      }),
      name: null,
      subject: {
        name: 'Chargement...',
        color: '#000000',
      },
      uuid: null,
      unsavedWork: false,
      countableJSloaded: false,
      counts: null,
    }
  },
  computed: {
    ...mapState(['now']),
    allCountsTooltip() {
      if (!this.counts) return false
      const { words, characters, paragraphs, sentences, all } = this.counts
      const wordsPerSentence = Math.round(words / sentences)
      return this.getStatsTooltip([
        { value: words, label: 'Mots' },
        { value: characters, label: 'Caractères' },
        { value: all, label: 'Caractères + espaces' },
        { value: sentences, label: 'Phrases' },
        { value: paragraphs, label: 'Paragraphes' },
        { value: wordsPerSentence, label: 'Mots / phrase' },
      ])
    },
    textDurations() {
      if (!this.counts) return false
      const { words } = this.counts
      const speeds = {
        speaking: 183,
        reading: 300,
      }
      const getTime = mode => {
        let raw = words / speeds[mode]
        let unit = 'm'
        if (raw < 1) {
          raw *= 60
          unit = 's'
        }
        return raw.toFixed(2) + unit
      }
      return {
        speaking: getTime('speaking'),
        reading: getTime('reading'),
      }
    },
    textDurationsTooltip() {
      const { reading, speaking } = this.textDurations
      return this.getStatsTooltip([
        { value: reading, label: 'Lecture' },
        { value: speaking, label: 'Parlé' },
      ])
    },
  },
  watch: {
    async subject() {
      await this.$store.dispatch('notes/patch', {
        uuid: this.uuid,
        modifications: {
          subject: this.subject,
        },
      })
    },
  },
  mounted() {
    this.$withLoadingScreen(
      async () => {
        // Load some data
        await this.$store.dispatch('settings/load')
        await this.$store.dispatch('notes/load')
        // Get note
        const { data } = await this.$axios.get(
          `/notes/${this.$route.params.uuid}`
        )
        this.editor.setContent(data.content.replace(/\n/g, '<br/>'))
        this.name = data.name
        this.subject = data.subject
        this.uuid = data.uuid
        // Set title
        this.updateDocumentTitle()
      },
      { title: 'Recherche du cahier au fond du sac' }
    )
    // Attach event listener for Ctrl + S (see: https://stackoverflow.com/a/55323073)
    document.addEventListener('keydown', this.kbShortcutSave)
    // Auto save every n minutes
    console.log(this.setting()('autosave'))
    const autosave = this.setting()('autosave') || 5
    this.autosaveInterval = setInterval(() => {
      this.$toast.info('Sauvegarde automatique effectuée', { icon: 'update' })
      this.save({ toast: false })
    }, autosave * 60 * 1000)

    let page = null
    let countableJSloaded = false
    const countableJSinitInterval = setInterval(() => {
      // Init Countable.js
      page = document.querySelector('.editor-page .ProseMirror')
      if (page) {
        // initial count + counts when edit
        Countable.count(page, counts => {
          this.counts = counts
        })
        Countable.on(page, counts => {
          this.counts = counts
        })
        countableJSloaded = true
      }
      if (countableJSloaded) {
        clearInterval(countableJSinitInterval)
      }
    }, 500)
  },
  async beforeDestroy() {
    clearInterval(this.autosaveInterval)
    await this.save({ toast: false })
    // When the note is empty
    // TODO(beta-1.0.0): move this to /notes/
    const html = this.editor.getHTML()
    if (html === '' || html === '<p></p>') {
      console.log('deleting empty note:' + this.editor.getHTML())
      await this.$store.dispatch('notes/delete', {
        uuid: this.uuid,
        toastMessage: 'Note vide supprimée',
      })
    }
    this.editor.destroy()
    document.removeEventListener('keydown', this.kbShortcutSave)
  },
  methods: {
    format,
    ...mapGetters('settings', { setting: 'value' }),
    updateNote({ getHTML, contentSize }) {
      this.$store.commit('notes/PATCH', {
        uuid: this.uuid,
        modifications: {
          content: getHTML(),
        },
      })
      console.log(contentSize)
      this.unsavedWork = true
    },
    save: debounce(
      async function({ toast }) {
        toast = toast === null ? true : toast
        const saved = await this.$store.dispatch('notes/save', {
          uuid: this.uuid,
          content: this.editor.getHTML(),
        })
        if (toast && saved) {
          this.$toast.success('Note sauvegardée', { icon: 'check' })
          this.unsavedWork = false
        }
      },
      1000,
      { leading: true, trailing: false }
    ),
    async kbShortcutSave(e) {
      if (!(e.keyCode === 83 && e.ctrlKey)) return
      e.preventDefault()
      await this.save({ toast: true })
    },
    updateName: debounce(
      async function() {
        await this.$store.dispatch('notes/patch', {
          uuid: this.uuid,
          modifications: {
            name: this.name,
          },
        })
        this.updateDocumentTitle()
      },
      { trailing: false, leading: true }
    ),
    updateDocumentTitle() {
      document.title = `${this.name || 'Note sans titre'} · schoolsyst`
    },
    getStatsTooltip(stats) {
      const maxCountLen = Math.max(stats.map(s => s.value.toString().length))
      const listItem = stat =>
        `<li><span style="font-family:var(--fonts-monospace-light)">${stat.value
          .toString()
          .padStart(maxCountLen, '')}</span> ${stat.label}</li>`

      return `
                <ul style="text-align:left">
                    ${stats.map(listItem)}
                </ul>
            `.trim()
    },
  },
}
</script>

<style lang="stylus" scoped>
body
  padding 1em
  background var(--grey-offset)

.toolbar
  position fixed
  top 0
  right 0
  left 0
  z-index 10
  padding 1em
  padding-bottom 0
  max-width 100vw
  border-bottom 2px solid rgba(0, 0, 0, 0.25)
  background var(--white)

  .headings-dropdown
    flex-shrink 0
    width 200px

    .heading-item
      font-family var(--fonts-regular)

    p.heading-item
      font-weight normal

.top
  display flex
  align-items center
  margin-bottom 0.75em
  margin-left 0.5em
  color var(--black)

  .title
    display flex
    flex-wrap nowrap
    align-items center
    width 100%
    font-size 1.5rem

    @media (max-width: 650px)
      flex-wrap wrap
      justify-content center

      .title-field
        text-align center

      .title-field::placeholder
        text-align center

    .title-field
      margin-left 0.5em
      width 100%
      height 2.5rem
      color var(--black)

    .subject
      margin-left 0.75em
      //font-size: 1rem

  .icon
    color var(--black)
    font-size 2em

  .title.untitled
    opacity 0.25

  .unsaved-work
    margin-left 0.5em
    font-size 0.85em

.menubar
  display flex
  flex-wrap wrap
  align-items center
  padding-bottom 0.5em
  //justify-content center
  transition opacity 0.5s ease

  @media (max-width: 650px)
    justify-content center

    & > :not(.mobile)
      display none

    .mobile
      i
        font-size 1.7em

      &:not(:last-child) i
        margin-left 0.5em

.menubar button
  display inline-flex
  justify-content center
  align-items center
  padding 0.5em
  height 2em
  color var(--black)

  &.active
    background var(--blue-offset)
    color var(--blue)

  &:hover
    color var(--blue)

.low-opacity, .sep
  opacity 0.25

.sep
  padding 0 0.25em
  font-weight thin
  font-size 2em

.show-bottom-bar
  position fixed
  right 1em
  bottom 1em

#bottom-bar
  display flex
  padding 0.75em 1em

  .time
    font-size 1.2em
    font-family var(--fonts-monospace-light)

  .stats
    display flex
    align-items center
    margin-left auto

  .stats li
    display inline-block

    &:not(:last-child)
      margin-right 0.5em

    .value
      font-family var(--fonts-monospace-light)

.ProseMirror::-moz-focus-inner
  padding 0
  border none !important

.editor-page-wrapper
  display flex
  justify-content center
  overflow auto
  padding-top 8rem
  padding-bottom 2rem
  min-height 100vh
  width 100%
  background var(--grey-offset)

.editor-page /deep/
  .inline-math
    color var(--blue)
    font-family Cambria Math

  td, tr
    border 2px solid black

  img
    max-width 100%
    max-height 50vh
    text-align center

    &.ProseMirror-selectednode
      border 2px solid var(--blue)

.editor-page
  margin-top 20px
  padding 3em
  width 800px
  background var(--white)
  font-family Arial, sans-serif
  line-height 1.2em

  & /deep/ .ProseMirror
    height 100%
    //overflow-y auto
    scrollbar-width thin
    scrollbar-color var(--grey-light) transparent

    &::-webkit-scrollbar-track
      background transparent

    &::-webkit-scrollbar-thumb
      background-color var(--grey-light)

    //page looks
    font-family var(--fonts-regular)

    p
      margin-bottom 0.2em

    h1, h2, h3, h4, h5, h6
      line-height 1.2

      &:not(:first-child)
        margin-top 1.2em

      &:not(:last-child)
        margin-bottom 0.5em

    h1
      text-align center

    ul, ol
      padding-left 2.5em

    ul li
      list-style-type disc

    hr
      margin 1em auto
      width 75%

    code
      font-family var(--fonts-monospace-light)

  .admonition
    &::before
      content 'more_vert'
      font-family 'Material Icons'

    &-danger
      background var(--red-offset)

    &-note
      background var(--blue-offset)
</style>
