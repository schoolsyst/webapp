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
                    button(title="Télécharger en... (Ctrl + Shift + S)")
                        Icon(filled) save_alt
                    //- button
                    //-     Icon share
                    //-     | Partager
                    button(title="Imprimmer (Ctrl + P)")
                        Icon(filled) print
                    button Apprendre...
                    span.sep |
                    button(title="Enlever le formatage (Ctrl + Shift + :)")
                        Icon format_clear
                    //- select Titre...
                    //-     template(v-for="level in [0, 1, 2, 3, 4, 5, 6]")
                    //-         option(@select="commands.heading({level})"): component(:is="`h${level}`") Titre
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
                    button(title="Maths (Ctrl + E)"): math: mi x
                    button(
                        :class="{active: isActive.code()}"
                        @click="commands.code"
                        title=""
                    )
                        code M
                    button(title="Superscript (Ctrl + Shift + ,)")
                        span.low-opacity a
                        sup n
                    button(title="Indice (Ctrl + ,)")
                        span.low-opacity a
                        sub n
                    span.sep |
                    button(title="Couleur de texte")
                        Icon(filled) format_color_text
                    button(title="Note de bas de page (Ctrl + ;)")
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
                        @click="commands.createTable({rowsCount: 2, colsCount: 2})"
                        title="Tableau"
                    )
                        Icon table_chart
                    //- button(@click="commands.blockquote")
                    //-     Icon format_quote
                    //dropdown: Admonitions (Ctrl + !)
                    button(@click="commands.code_block" title="Bloc de code")
                        Icon code
                    button(title="Bloc de maths (Ctrl + Shift + E)"): Icon functions
                    button(title="Image"): Icon image
        .editor-page-wrapper
            editor-content.editor-page(:editor="editor")
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
    TableRow,
    TodoItem,
    TodoList,
    Bold,
    Code,
    Italic,
    Link,
    Strike,
    Underline,
    History,
    BulletList,
} from 'tiptap-extensions'
import Icon from '~/components/Icon.vue'
import InputField from '~/components/InputField.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import { mapGetters, mapActions } from 'vuex'
import debounce from 'lodash.debounce'

export default {
    components: { Editor, InputField,  EditorContent, EditorMenuBar, Icon, BadgeSubject, PickerSubject },
    layout: 'bare',
    data() {
        return {
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
                ],
                content: ``,
                onUpdate: this.updateNote
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
            await this.$store.dispatch('notes/save', { 
                uuid: this.uuid, 
                content: this.editor.getHTML()
            })
            if(toast) this.$toast.success('Note sauvegardée', {icon: 'check'})
            this.unsavedWork = false
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
        this.$loadingOverlay(async () => {
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
        }, 5 * 60 * 1000);
    },
    beforeDestroy() {
        clearInterval(this.autosaveInterval)
        this.save({toast: false})
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
.top
    margin-left: 0.5em
    margin-bottom .75em
    display flex
    align-items center
    .title
        width: 100%
        display: flex
        align-items center
        font-size: 2rem
        .title-field
            margin-left .5em
            width: 100%
            height 2.5rem
        .subject
            margin-left .75em
    .icon
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
    padding-top 7em
    display flex
    justify-content center
    width 100%
    height 100vh
    background var(--offset-grey)
    .editor-page
        margin-top: 20px
        padding 3em
        width: 800px
        background var(--white)

.editor-page table
    td, tr
        border 2px solid black
.editor-page
    font-family Arial, sans-serif
    line-height 1.2em
    p
        margin-bottom 0.2em

    .admonition
        &::before
            content 'more_vert'
            font-family 'Material Icons'
            
        &-danger
            background var(--offset-red)
        &-note
            background var(--offset-blue)
</style>
