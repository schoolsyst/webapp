<template lang="pug">
    .container
        PickerSubject(
            @pick="subject = $event"
        )
        .toolbar
            .top
                nuxt-link(to="/notes"): Icon.icon arrow_back
                .title
                    BadgeSubject.subject(
                        v-bind="subject" 
                        clickable @click="$modal.show('subject-picker')"
                    )
                    input.title-field(
                        placeholder="Document sans titre"
                        v-model.lazy="name"
                        name="name"
                        type="text"
                    )
                    a.unsaved-work(
                        v-show="unsavedWork" 
                        title="Modifications non sauvegardées"
                        @click="save({toast: true})"
                    ) &bull;

            EditorMenuBar(:editor="editor" v-slot="{commands, isActive}")
                .menubar
                    button(@click="$modal.show('edit-properties')" title="Propriétés de la note...")
                        Icon settings
                    button(@click="commands.undo" title="Annuler (Ctrl + Z)")
                        Icon undo
                    button(@click="commands.redo" title="Refaire (Ctrl + Shift + Z)")
                        Icon redo
                    span.sep |
                    //- The key shortcut listener for Ctrl + S is managed with a manual event listener.
                    //- See: https://stackoverflow.com/a/55323073
                    button(
                        @click="save({toast: true})"
                        title="Sauvegarder (Ctrl + S)"
                    )
                        Icon(filled) save
                    button(title="Télécharger en... (Ctrl + Shift + S)" @click="$modal.show('download-as')")
                        Icon(filled) save_alt
                    //- button
                    //-     Icon share
                    //-     | Partager
                    button(title="Imprimmer (Ctrl + P)")
                        Icon(filled) print
                    button Réviser...
                    span.sep |
                    button(title="Enlever le formatage (Ctrl + Shift + :)")
                        Icon format_clear
                    multiselect(
                        @select="\
                            $event === 0 \
                            ? commands.paragraph \
                            : commands.heading({level: $event})\
                        "
                        :value="\
                            isActive.heading({level: 1}) ? 1 : (\
                            isActive.heading({level: 2}) ? 2 : (\
                            isActive.heading({level: 3}) ? 3 : (\
                            isActive.heading({level: 4}) ? 4 : (\
                            isActive.heading({level: 5}) ? 5 : (\
                            isActive.heading({level: 6}) ? 6 : 0\
                        )))))"
                        :options="[1, 2, 3, 4]"
                        :searchable="false"
                        :show-labels="false"
                        placeholder="Titre..."
                        :custom-label="(level) => headingLevelNames[level]"
                    )
                        template(slot="option", slot-scope="props")
                            component(:is="props.option === 0 ? 'p' : 'h' + props.option") {{headingLevelNames[props.option]}}

                    span.sep |
                    button(
                        :class="{active: isActive.bold()}"
                        @click="commands.bold"
                        title="Gras (Ctrl + B)"
                    )
                        Icon format_bold
                    button(
                        :class="{active: isActive.italic()}"
                        @click="commands.italic"
                        title="Italique (Ctrl + I)"
                    )
                        Icon format_italic
                    button(
                        :class="{active: isActive.underline()}"
                        @click="commands.underline"
                        title="Souligné (Ctrl + U)"
                    )
                        Icon format_underlined
                    button(
                        :class="{active: isActive.strike()}"
                        @click="commands.strike"
                        title="Barré (Ctrl + D)"
                    )
                        Icon format_strikethrough
                    button(
                        :class="{active: isActive.math()}"
                        @click="commands.math"
                        title="Maths (Ctrl + E)"
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
                        title="Superscript (Ctrl + ;)"
                    )
                        span.low-opacity a
                        sup n
                    button(
                        :class="{active: isActive.subscript()}"
                        @click="commands.subscript"
                        title="Indice (Ctrl + ,)"
                    )
                        span.low-opacity a
                        sub n
                    button(title="Couleur de texte" @click="$modal.show('text-color')")
                        Icon(filled) format_color_text
                    button(
                        :class="{active: isActive.marker()}"
                        @click="commands.marker"
                        title="Surligné"
                    )
                        Icon(filled) border_color
                    span.sep |
                    button(title="Note de bas de page (Ctrl + Alt + F)")
                        | Note#[sup 1]
                    button(title="Lien (Ctrl + K)")
                        Icon insert_link
                    button(
                        @click="commands.bullet_list"
                        title="Liste à points (Ctrl + Shift + 8)"
                    )
                        Icon format_list_bulleted
                    button(
                        @click="commands.ordered_list"
                        title="Liste numérotée (Ctrl + Shift + 9)"
                    )
                        Icon format_list_numbered
                    button(title="Liste de définitions (Ctrl + Shift + 0)")
                        | Def:
                    button(title="Abbréviation (Ctrl + *)")
                        | abbr
                    span.sep |
                    button(
                        @click="commands.horizontal_rule"
                        title="Ligne horizontale"
                    ) 
                        | —
                    button(
                        :class="{active: isActive.table()}"
                        @click="commands.createTable({rowsCount: 2, colsCount: 2})"
                        title="Tableau"
                    )
                        Icon table_chart
                    //- button(@click="commands.blockquote")
                    //-     Icon format_quote
                    //dropdown: Admonitions (Ctrl + !)
                    button(@click="commands.code_block" title="Bloc de code")
                        Icon code
                    button(@click="commands.mathblock" title="Bloc de maths (Ctrl + Shift + E)"): Icon functions
                    button(title="Image"): Icon image
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
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
    CodeBlock,
    CodeBlockHighlight,
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
// import Code from '~/plugins/tiptap-extensions/Code'
// import Bold from '~/plugins/tiptap-extensions/Bold'
// import Italic from '~/plugins/tiptap-extensions/Italic'
// import Link from '~/plugins/tiptap-extensions/Link'
// import Strike from '~/plugins/tiptap-extensions/Strike'
// import Underline from '~/plugins/tiptap-extensions/Underline'
import Superscript from '~/plugins/tiptap-extensions/Superscript'
import MathBlock from '~/plugins/tiptap-extensions/MathBlock'
import Math from '~/plugins/tiptap-extensions/Math'
import Marker from '~/plugins/tiptap-extensions/Marker'
import Subscript from '~/plugins/tiptap-extensions/Subscript'
import Icon from '~/components/Icon.vue'
import InputField from '~/components/InputField.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import { mapGetters, mapActions } from 'vuex'
import debounce from 'lodash.debounce'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

export default {
    components: { Editor, InputField,  EditorContent, EditorMenuBar, Icon, BadgeSubject, PickerSubject, Multiselect },
    layout: 'bare',
    head: {
        title: name
    },
    data() {
        return {
            headingLevelNames: ['Normal', 'Titre', 'Partie', 'Sous-partie', 'Sous-partie', 'Titre 5', 'Titre 6'],
            editor: new Editor({
                extensions: [
                    new CodeBlock(),
                    new HardBreak(),
                    new Heading({ levels: [1, 2, 3, 4, 5, 6]}),
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
                    new Marker(),
                    new Subscript(),
                    new Superscript(),
                    new Math()
                ],
                content: ``,
            }),
            name: null,
            subject: {
                name: 'Chargement...',
                color: '#000000'
            },
            uuid: null,
            unsavedWork: false
        }
    },
    methods: {
        ...mapGetters('settings', {setting: 'value'}),
        updateNote({getHTML}) {
            this.$store.commit('notes/PATCH', {uuid: this.uuid, modifications: {
                content: getHTML()
            }})
            this.unsavedWork = true
        },
        save: debounce(async function({toast}) {
            toast = toast === null ? true : toast
            let saved = await this.$store.dispatch('notes/save', { 
                uuid: this.uuid, 
                content: this.editor.getHTML()
            })
            if(toast && saved) {
                this.$toast.success('Note sauvegardée', {icon: 'check'})
                this.unsavedWork = false
            }
        }, 1000, { leading: true, trailing: false }),
        async kbShortcutSave(e) {
            if (!(e.keyCode === 83 && e.ctrlKey)) return
            e.preventDefault()
            await this.save({toast: true})
        }
    },
    watch: {
        async name() {
            await this.$store.dispatch('notes/patch', { 
                uuid: this.uuid, 
                modifications: { 
                    name: this.name
                }
            })
        },
        async subject() {
            await this.$store.dispatch('notes/patch', {
                uuid: this.uuid,
                modifications: {
                    subject: this.subject
                }
            })
        }
    }, 
    async mounted() {
        this.$withLoadingScreen(async () => {
            // Load some data
            await this.$store.dispatch('settings/load')
            await this.$store.dispatch('notes/load')
            // Get note
            const { data } = await this.$axios.get(`/notes/${this.$route.params.uuid}`)
            this.editor.setContent(data.content.replace(/\n/g, '<br/>'))
            this.name = data.name
            this.subject = data.subject
            this.uuid = data.uuid
        }, { title: "Recherche du cahier au fond du sac" })
        // Attach event listener for Ctrl + S (see: https://stackoverflow.com/a/55323073)
        document.addEventListener('keydown', this.kbShortcutSave)
        // Auto save every n minutes
        console.log(this.setting()('autosave'))
        let autosave = this.setting()('autosave') || 5
        this.autosaveInterval = setInterval(() => {
            this.$toast.info('Sauvegarde automatique effectuée', {icon: 'update'})
            this.save({toast: false})
        }, 5 * 60 * 1000)
    },
    async beforeDestroy() {
        clearInterval(this.autosaveInterval)
        await this.save({toast: false})
        // When the note is empty
        if (this.editor.getHTML() === '') {

        }
        this.editor.destroy()
        document.removeEventListener('keydown', this.kbShortcutSave)
    }
}
</script>

<style lang="stylus" scoped>
body
    padding 1em
    background var(--offset-grey)
.toolbar
    position fixed
    top: 0
    left: 0
    right: 0
    background var(--white)
    z-index: 10
    padding 1em
    padding-bottom: 0
    border-bottom 2px solid rgba(0,0,0,0.25)
    max-width: 100vw
    .multiselect
        sel-width = 12em
        width (sel-width)
        cursor pointer
        & /deep/ .multiselect__content-wrapper
            width (sel-width)
            border-radius var(--border-radius)
            border-top-left-radius 0
            border-top-right-radius 0
            background-color var(--white)
            color var(--black)
            overflow-x hidden
            border-color var(--grey-light)
            border-width 2px
        & /deep/ .multiselect__option
        & /deep/ .multiselect__tags
            width (sel-width)
            background-color var(--white)
            color var(--black)
            font-size 1rem
            border-color var(--grey-light)
            border-width 2px
        & /deep/ .multiselect__single
            background-color var(--white)
            white-space nowrap
            text-overflow ellipsis
            overflow: hidden
        & /deep/ .multiselect__select
            color var(--black)
.top
    margin-left: 0.5em
    margin-bottom .75em
    display flex
    align-items center
    color var(--black)
    .title
        width: 100%
        display: flex
        align-items center
        font-size: 2rem
        .title-field
            margin-left .5em
            width: 100%
            height 2.5rem
            color var(--black)
        .subject
            margin-left .75em
    .icon
        color var(--black)
        font-size: 2em
    .title.untitled
        opacity: 0.25
    .unsaved-work
        font-size: 0.85em
        margin-left: 0.5em
.menubar
    padding-bottom .5em
    display flex
    align-items center
    // justify-content center
    transition opacity 0.5s ease
.menubar button
    display inline-flex
    justify-content center
    align-items center
    padding: .5em
    height 2em
    color var(--black)
    &.active
        color var(--blue)
        background var(--offset-blue)
    &:hover
        color var(--blue)
.low-opacity, .sep
    opacity: 0.25
.sep
    font-weight thin
    font-size 2em
    padding 0 0.25em

.ProseMirror::-moz-focus-inner
    border none !important
    padding 0

.editor-page-wrapper
    padding-top 8rem
    padding-bottom 2rem
    display flex
    justify-content center
    width 100%
    min-height 100vh
    background var(--offset-grey)
    overflow auto

.editor-page /deep/ 
    .inline-math
        font-family Cambria Math
        color var(--blue)
    td, tr
        border 2px solid black
    img
        max-width: 100%
        max-height: 50vh
        text-align center
        &.ProseMirror-selectednode
            border 2px solid var(--blue)
.editor-page
    font-family Arial, sans-serif
    line-height 1.2em
    margin-top 20px
    padding 3em
    width 800px
    background var(--white)
    p
        margin-bottom 0.2em
    & /deep/ .ProseMirror
        height: 100%
        // overflow-y auto
        scrollbar-width thin
        scrollbar-color var(--grey-light) transparent
        &::-webkit-scrollbar-track
            background transparent
        &::-webkit-scrollbar-thumb
            background-color var(--grey-light)
    .admonition
        &::before
            content 'more_vert'
            font-family 'Material Icons'
            
        &-danger
            background var(--offset-red)
        &-note
            background var(--offset-blue)
</style>
