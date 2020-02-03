<template lang="pug">
multiselect(
  v-bind="{\
    selectedLabel, selectLabel, deselectLabel,\
    placeholder, name: dName, label,\
    allowEmpty, searchable, options, customLabel\
  }"
  :track-by="trackBy || 'uuid'"
  @input="$emit('input', (trackBy ? $event[trackBy] : $event))"
  :value="trackBy ? (options.find(opt => opt[trackBy] === value)) : value"

)
  // Pass on all named slots
  slot(
    v-for="slot in Object.keys($slots)"
    :name="slot" :slot="slot"
  )
  // Pass on all scoped slots
  template(
    v-for="slot in Object.keys($scopedSlots)"
    :slot="slot"
    slot-scope="scope"
  )
    slot(:name="slot" v-bind="scope")
</template>

<script>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

export default {
  components: { Multiselect },
  props: {
    value: {
      type: [String, Number, Object],
      required: true
    },
    selectedLabel: {
      type: String,
      default: ''
    },
    selectLabel: {
      type: String,
      default: ''
    },
    deselectLabel: {
      type: String,
      default: ''
    },
    trackBy: {
      type: String,
      default: 'key'
    },
    placeholder: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: 'label'
    },
    allowEmpty: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    customLabel: {
      type: Function,
      default: undefined
    }
  },
  computed: {
    dName() {
      if (this.name) {
        return this.name
      } else {
        const ret = 'unknown-' + this._uid
        console.group(`${this._name} PROPS WARNING`)
        console.warn(`No name attribute given, falling back to "${ret}"`)
        console.warn(`Failing element:`)
        console.warn(this.$el ? this.$el : this)
        console.groupEnd()
        return ret
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
body .multiselect
  sel-width = 20rem
  // width: sel-width
  cursor: pointer
  // display flex
  align-items: center

  & /deep/ .multiselect__content-wrapper
    // width: sel-width
    border-radius: var(--border-radius)
    border-top-left-radius: 0
    border-top-right-radius: 0
    background-color: var(--white)
    color: var(--black)
    overflow-x: hidden
    border-color: var(--grey-dark)
    border-width: 2px

  & /deep/ .multiselect__option, & /deep/ .multiselect__single
    display: flex
    align-items: center

    .subject
      margin-right: 0.5em

  & /deep/ .multiselect__option
    &--highlight, &--selected
      background: var(--blue-offset)
      color: var(--black)

  & /deep/ .multiselect__tags, & /deep/ .multiselect__input
    height: 100%
    width: 100%
    background-color: var(--white)
    color: var(--black)
    font-size: 1rem
    border-color: var(--grey-dark)
    border-width: 2px
    display: flex
    align-items: center

  & /deep/ .multiselect__single
    background-color: var(--white)
    white-space: nowrap
    text-overflow: ellipsis
    overflow: hidden

  & /deep/ .multiselect__select::before
    border-top-color: var(--black)

  & /deep/ .multiselect__input::placeholder, & /deep/ .multiselect__placeholder
    color: var(--grey-light)
    opacity: 1
</style>
