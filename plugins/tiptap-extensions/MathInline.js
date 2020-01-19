import { Mark } from 'tiptap'
import { toggleMark, markInputRule, markPasteRule } from 'tiptap-commands'

export default class Math extends Mark {
  get name() {
    return 'math'
  }

  get schema() {
    return {
      excludes: '_',
      parseDOM: [
        {
          tag: 'math[display=inline]'
        },
        {
          tag: 'span.inline-math'
        }
      ],
      toDOM: () => ['span', { class: 'inline-math asciimath' }, 0]
    }
  }

  keys({ type }) {
    return {
      'Mod-e': toggleMark(type)
    }
  }

  commands({ type }) {
    return () => toggleMark(type)
  }

  inputRules({ type }) {
    return [markInputRule(/(?:^|[^[\]])(\[\[([^[\]]+)\]\])$/, type)]
  }

  pasteRules({ type }) {
    return [markPasteRule(/\[\[([^[\]]+)\]\]/g, type)]
  }
}
