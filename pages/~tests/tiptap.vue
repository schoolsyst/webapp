<template lang="pug">
    .container
        .toolbar
            .top
                nuxt-link(to="/notes"): Icon.icon arrow_back
                h1(contenteditable) Title

            EditorMenuBar(:editor="editor" v-slot="{commands, isActive}")
                .menubar
                    button(@click="commands.undo" title="Annuler (Ctrl + Z)")
                        Icon undo
                    button(@click="commands.redo" title="Refaire (Ctrl + Shift + Z)")
                        Icon redo
                    button(title="Sauvegarder (Ctrl + S)")
                        Icon(filled) save
                    span.sep |
                    button(title="Ctrl + Shift + S")
                        //- Icon(filled) save_alt
                        | Exporter
                    //- button
                    //-     Icon share
                    //-     | Partager
                    button(title="Ctrl + P")
                        //- Icon print
                        | Imprimmer
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
        .editor-page-wrapper: editor-content.editor-page(:editor="editor")
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

export default {
    components: { Editor, EditorContent, EditorMenuBar, Icon },
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
                content: '<p>Just a good ol\' p-tag</p>'
            }),
        }
    },
    beforeDestroy() {
        this.editor.destroy()
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
    h1
        margin-left .25em
    .icon
        font-size: 2em
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
</style>
