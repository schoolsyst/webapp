<template lang="pug">
    .container
        EditorMenuBar(:editor="editor" v-slot="{commands, isActive}")
            .menubar
                button(
                    v-for="action in editorActions"
                    :class="{active: isActive[action]() }"
                    @click="commands[action]"
                ): Icon format_{{ action }}
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
                    new Heading({ levels: [1, 2, 3]}),
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
                    new History()
                ],
                content: '<p>Just a good ol\' p-tag</p>'
            }),
            editorActions: [
                {
                    icon: 'code',
                    action: 'CodeBlock',
                },
                {
                    icon: 'code',
                    action: 'CodeBlockHighlight',
                },
                {
                    icon: 'HardBreak',
                    action: 'HardBreak',
                },
                {
                    icon: 'heading',
                    action: 'Heading',
                },
                {
                    icon: 'HorizontalRule',
                    action: 'HorizontalRule',
                },
                {
                    icon: 'Image',
                    action: 'Image',
                },
                {
                    icon: 'ListItem',
                    action: 'ListItem',
                },
                {
                    icon: 'Mention',
                    action: 'Mention',
                },
                {
                    icon: 'OrderedList',
                    action: 'OrderedList',
                },
                {
                    icon: 'Table',
                    action: 'Table',
                },
                {
                    icon: 'TableHeader',
                    action: 'TableHeader',
                },
                {
                    icon: 'TableCell',
                    action: 'TableCell',
                },
                {
                    icon: 'TableRow',
                    action: 'TableRow',
                },
                {
                    icon: 'TodoItem',
                    action: 'TodoItem',
                },
                {
                    icon: 'TodoList',
                    action: 'TodoList',
                },
                {
                    icon: 'Bold',
                    action: 'Bold',
                },
                {
                    icon: 'Code',
                    action: 'Code',
                },
                {
                    icon: 'Italic',
                    action: 'Italic',
                },
                {
                    icon: 'Link',
                    action: 'Link',
                },
                {
                    icon: 'Strike',
                    action: 'Strike',
                },
                {
                    icon: 'Underline',
                    action: 'Underline',
                },
                {
                    icon: 'History',
                    action: 'History',
                },
            ]
        }
    },
    beforeDestroy() {
        this.editor.destroy()
    }
}
</script>
