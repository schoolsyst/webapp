import { Mark } from 'tiptap'
import { toggleMark, markInputRule, markPasteRule } from 'tiptap-commands'

export default class Marker extends Mark {
  get name() {
    return 'marker'
  }

  get schema() {
    return {
      parseDOM: [
        {
          tag: 'mark',
        },
      ],
      toDOM: () => ['mark', 0],
    }
  }

  keys({ type }) {
    return {
      'Mod-j': toggleMark(type),
    }
  }

  commands({ type }) {
    return () => toggleMark(type)
  }

  inputRules({ type }) {
    return [markInputRule(/(?:^|[^=])(==([^=]+)==)$/, type)]
  }

  pasteRules({ type }) {
    return [markPasteRule(/==([^=]+)==/g, type)]
  }
}
