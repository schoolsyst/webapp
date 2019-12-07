<template lang="pug">
    .container
        PickerSubject(name="tiptap")
        .toolbar
            .top
                nuxt-link(to="/notes"): Icon.icon arrow_back
                h1
                    BadgeSubject.subject(name="Русский", color="#F57C00" clickable open-modal="tiptap-subject-picker")
                    span(contenteditable) Title

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
                    button(title="Image"): Icon image
        .editor-page-wrapper
            .editor-page(v-html="content")
            //- editor-content.editor-page(:editor="editor")
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
import BadgeSubject from '~/components/BadgeSubject.vue'
import PickerSubject from '~/components/PickerSubject.vue'

export default {
    components: { Editor, EditorContent, EditorMenuBar, Icon, BadgeSubject, PickerSubject },
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
                content: ``
            }),
            content: `
                    <h1>First header</h1>
                    <h2>Second header</h2>
                    <h3>Third header</h3>
                    <h4>Fourth header</h4>
                    <h5>Fifth header</h5>
                    <h6>Smallest header</h6>
                    <p> 
                       <br> Footnotes<sup><a href="#fn-1-def" id="fn-1-usage-1">1</a></sup>
                       <br> <u>Underlined</u>
                       <br> <s>Strikethrough</s> 
                       <br> <em>Italic</em> 
                       <br> <strong>Bold</strong> 
                       <br> <code>Monospace</code> 
                       <br>  <sup>Super</sup>script 
                       <br>  <sub>Sub</sub>script 
                       <br>  <a href="#">Named link</a>  
                       <br>  <mark> Highlighted </mark> 
                       <br>  <math> <mi>mαth</mi> </math> 
                       <br>  <ol> <li> Ordered </li> <li> Lists </li> </ol> 
                       <br>  <ul> <li> Unordered </li> <li> Lists </li> </ul> 
                       <br>  <abbr title="Support For Abbreviations Is Useful"> SFAIU </abbr> 
                       <br>  <dl> <dt> Definition </dt> <dd> Lists </dd> <dd> And </dd> <dt> Multiple </dt> <dd> Terms </dd> </dl> 
                       <br> <span style="color: red"> colored </span> <span style="color: cyan"> text </span>
                    </p>
                    <code><pre>
                    A code block.
                    Lorem ipsum dolor sit amet.
                    </pre></code>
                    <blockquote>A blockquote </blockquote>
                    An horizontal rule:
                    <hr>

                    <center> <table> <tr> <td> A </td><td> table </td> </tr> <tr> <td> with </td> <td> rows. </td> </tr> </table> </center>

                    <center> <math title="E=m c^2 e^(i pi)=-1 AA x in ZZ (sin^2x+cos^2x=1) sum_(i=1)^n i^3=((n(n+1))/2)^2 "><mstyle displaystyle="true" mathsize="1em"><mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup><msup><mi>e</mi><mrow><mi>i</mi><mi>π</mi></mrow></msup><mo>=</mo><mo>-</mo><mn>1</mn><mo>∀</mo><mi>x</mi><mo>∈</mo><mo>ℤ</mo><mrow><mo>(</mo><msup><mo>sin</mo><mn>2</mn></msup><mi>x</mi><mo>+</mo><msup><mo>cos</mo><mn>2</mn></msup><mi>x</mi><mo>=</mo><mn>1</mn><mo>)</mo></mrow><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover></mrow><msup><mi>i</mi><mn>3</mn></msup><mo>=</mo><msup><mrow><mo>(</mo><mfrac><mrow><mi>n</mi><mrow><mo>(</mo><mi>n</mi><mo>+</mo><mn>1</mn><mo>)</mo></mrow></mrow><mn>2</mn></mfrac><mo>)</mo></mrow><mn>2</mn></msup></mstyle></math></center>

                    <center> <img src="https://picsum.photos/800/500/"> </center>

                    <p class="admonition admonition-note"> Admonition block, normal </p>
                    <p class="admonition admonition-danger"> Admonition block, 'danger' version </p>

                    <p> And finally, some normal text!</p>

                    <hr id="fn-sep">
                    <ol> <li id="fn-1-def"> The footnote's content. <a href="#fn-1-usage-1"> ↑ </a></li> </ol>
                `
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
        display flex
        align-items center
        margin-left 1.5em
        .subject
            margin-right .75em
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
