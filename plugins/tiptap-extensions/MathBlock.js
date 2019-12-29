import { Node } from 'tiptap'
import { wrappingInputRule, setBlockType, toggleWrap } from 'tiptap-commands'

export default class MathBlock extends Node {
  get name() {
    return 'mathblock'
  }
  
  get schema() {
    return {
      content: 'block',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: [
        { tag: 'math[display=block]' }
      ],
      toDOM: () => ['math', {display: 'block'}, 0],
    }
  }

  commands({ type, schema }) {
    return () => toggleWrap(type)
  }

  keys({ type }) {
    return {
      'Mod-Shift-e': toggleWrap(type)
    }
  }

  inputRules({ type }) {
    return [
      wrappingInputRule(/^\s*%%%\s$/, type)
    ]
  }
}
