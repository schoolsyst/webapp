<template lang="pug">
    .container
        EditorMenuBar(:editor="editor" v-slot="{commands, isActive, focused}")
            .menubar(:class="{focused}")
                button(@click="commands.undo"): Icon undo
                button(@click="commands.redo"): Icon redo
                span.sep |
                button Sauvegarder
                button Exporter
                button Partager
                button Imprimmer
                button Apprendre...
                span.sep |
                button: Icon format_clear
                //- select Titre...
                //-     template(v-for="level in [0, 1, 2, 3, 4, 5, 6]")
                //-         option(@select="commands.heading({level})"): component(:is="`h${level}`") Titre
                span.sep |
                button(
                    :class="{active: isActive.bold()}"
                    @click="commands.bold"
                )
                    strong B
                button(
                    :class="{active: isActive.italic()}"
                    @click="commands.italic"
                )
                    em I
                button(
                    :class="{active: isActive.underline()}"
                    @click="commands.underline"
                )
                    u U
                button(
                    :class="{active: isActive.strike()}"
                    @click="commands.strike"
                )
                    s S
                button: math: mi x
                button(
                    :class="{active: isActive.code()}"
                    @click="commands.code"
                )
                    code M
                button 
                    span.low-opacity a
                    sup n
                button 
                    span.low-opacity a
                    sub n
                span.sep |
                button: Icon(filled) format_color_text
                button Note#[sup 1]
                button: Icon insert_link
                button(@click="commands.bullet_list")
                    Icon format_list_bulleted
                button(@click="commands.ordered_list")
                    Icon format_list_numbered
                button Def:
                button abbr
                span.sep |
                button(@click="commands.horizontal_rule") 
                    | —
                button(@click="commands.createTable({rowsCount: 2, colsCount: 2})")
                    Icon table_chart
                button(@click="commands.blockquote")
                    Icon format_quote
                //dropdown: Admonitions
                button(@click="commands.code_block")
                    Icon code
                button: Icon function
        editor-content(:editor="editor")
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
    data() {
        return {
            editor: new Editor({
                extensions: [
                    new CodeBlock(),
                    new CodeBlockHighlight(),
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
.menubar
    opacity: 0
    &.focused
        opacity: 1
.menubar
    margin-bottom: 30px
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
</style>
