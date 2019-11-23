<template lang="pug">
  .field(:class="{active, errored, filled: !!value}")
    .field-inner
      button.action(
        v-if="showActionButton"
        @click.prevent="action()"
      )
        i.material-icons-outlined {{actionButtonIcon}}
      input(
        :type="passwordShown ? 'text' : type"
        :name="dName"
        :id="`input-field--${dName}`"
        @input="$emit('input', $event.target.value); active = true"
        @click="active = true"
        @blur="active = false; passwordShown = false"
        :value="value"
        :class="passwordShown ? '-font-monospace' : ''"
      )
      label(
        :for="`input-field--${dName}`"
        :style="`background: ${active ? backgroundColor : 'transparent'};`"
      )
        slot
    .errors(v-if="errored")
      ul
        li(v-for="error in validation.errors[name]" :key="error") {{error}}
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      default: null
    },
    validation: {
      type: Object,
      default: () => ({validated: true, errors: {}})
    },
    value: {
      default: ""
    },
    hideActionButton: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: 'white'
    },
    placeholder: String
  },
  data() {
    return {
      active: false,
      passwordShown: false
    }
  },
  computed: {
    showActionButton() {
      if (this.hideActionButton) return false
      return !!this.value
    },
    actionButtonIcon() {
      if (this.type === 'password')
        return this.passwordShown ? 'visibility_off' : 'visibility'
      else
        return 'clear'
    },
    dName() {
      /* Computed default name for some HTML input types */
      if (this.name) 
        return this.name 
      if (['password', 'email', 'date'].includes(this.type))
        return this.type
      else {
        const ret = 'unknown-' + this._uid
        console.group(`${this._name} PROPS WARNING`)
        console.warn(`No name attribute given, falling back to "${ret}"`)
        console.warn(`Failing element:`)
        console.warn(this.$el ? this.$el : this)
        console.groupEnd()
        return ret
      }
    },
    errored() {
      return (
        !this.validation.validated 
        && this.dName in this.validation.errors 
        && this.validation.errors[this.dName].length > 0
      )
    }
  },
  methods: {
    clearField() {
      console.log(`Cleared field @ ${this.name}#${this._uid}`)
      this.$emit('input', '')
    },
    togglePasswordVisibility() {
      this.passwordShown = !this.passwordShown
    },
    action() {
      if (this.type === 'password')
        this.togglePasswordVisibility()
      else
        this.clearField()
    },
  }
}
</script>

<style lang="stylus" scoped>
// ===== Vars
side-padding = 15px
// ==== Setup
.field
  // Used for the label's absolute positionning
  position relative
  // The label goes outside the bounding box and will potentially overlap with stuff around the field if we don't do this
  padding-top: calc(1em + 3px)
.field-inner
  // Vertically center the action button
  display flex
  align-items center
// ==== Typography
label
  text-transform uppercase
  letter-spacing 1px
  font-size 0.75em
  font-weight 500
// ===== Passive state
input
  // LAYOUT
  min-width 300px
  padding 15px side-padding
  padding-right (side-padding * 2 + 10px)
  // LOOKS
  background transparent
  border 2px solid #00000088
  border-radius 5px
label
  position absolute
  left 5px
  padding 0 5px
  top 0px
  background transparent
// ===== Hover state
input:hover, input:focus
  &
    border-color black
    outline none
  & + label
    left 10px
// ===== Active state
.active
  label
    top 15px
    left 10px
    color var(--blue)
  input
    border-color var(--blue)
// ===== Errored state
.field.errored
  label
    color var(--red)
  input
    border-color var(--red)
// ===== Filled state
.field:not(.active).filled label
  color #000000cc
// ===== Interactions
input
  transition all .25s ease
label
  transition left .125s ease, top .125s ease, color .25s ease, background .01s ease
.action
  display none
.field:hover, .field.active
  .action
    display block
// ==== Other elements
.action
  position absolute
  right: side-padding
  z-index: 2
.errors
  color var(--red)
  font-size: 0.85em
  margin-top: 0.85em
</style>
