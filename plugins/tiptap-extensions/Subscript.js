import { Mark } from 'tiptap'
import { toggleMark, markInputRule, markPasteRule } from 'tiptap-commands'

export default class Subscript extends Mark {
  get name() {
    return 'subscript'
  }

  get schema() {
    return {
      parseDOM: [
        {
          tag: 'sub'
        }
      ],
      toDOM: () => ['sub', 0]
    }
  }

  keys({ type }) {
    return {
      'Mod-,': toggleMark(type)
    }
  }

  commands({ type }) {
    return () => toggleMark(type)
  }

  inputRules({ type }) {
    return [markInputRule(/(?:^|[^~])(~([^~]+)~)$/, type)]
  }

  pasteRules({ type }) {
    return [markPasteRule(/~([^~]+)~/g, type)]
  }
}
