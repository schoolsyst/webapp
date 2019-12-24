<template lang="pug">
  .field(
    :class="{\
      active, errored, disabled, \
      filled: !!value, \
      'has-label': !noLabel, \
      [`variant-${variant}`]: true,\
      [`type-${type}`]: true,\
    }"
    :name="dName"
    :data-variant="variant"
  )
    .field-inner
      button.action(
        v-if="actionIcon || showActionButton"
        @click.prevent="action($event)"
        :class="{'always-show': actionIcon}"
        tabindex="-1"
      )
        i.material-icons-outlined {{actionButtonIcon}}
      component.input(
        :is="type === 'block' ? 'textarea' : 'input'"
        :name="dName"
        :type="passwordShown ? 'text' : type"
        :id="`input-field--${dName}`"
        :style="{\
          fontFamily: `var(--fonts-${passwordShown ? 'monospace' : 'regular'}`,\
          resize: resizable && type === 'block' ? resizable : 'none'\
        }"
        :value="toHTMLValue(value)"
        v-bind="{value, tabindex, placeholder, disabled}"
        :step="type === 'number' ? 0.001 : null"
        @input="active = true; initial = false; $emit('input', toJSValue($event.target.value))"
        @click="active = true; $emit('active', $event)"
        @blur="active = false; passwordShown = false; $emit('blur', $event)"
        @focus="active = false; $emit('active', $event)"
      )
      label(
        :for="`input-field--${dName}`"
        :style="`background: ${active ? backgroundColor : 'transparent'};`"
      )
        slot
    p.error(v-if="!noErrorMessages") 
      | {{errored ? validation.errors[camelCaseName][0] : ""}}
</template>

<script>
import { parseISO, formatISO } from 'date-fns'

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
    noActionButton: {
      type: Boolean,
      default: false
    },
    actionIcon: {
      type: String,
      default: null
    },
    backgroundColor: {
      type: String,
      default: 'var(--white)'
    },
    placeholder: String,
    noErrorMessages: {
      type: Boolean,
      default: false
    },
    noLabel: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: [String, Boolean],
      default: false
    },
    variant: {
      type: String,
      default: 'outline'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    resizable: {
      type: [Boolean, String],
      default: false
    }
  },
  data() {
    return {
      active: false,
      passwordShown: false,
      initial: true
    }
  },
  computed: {
    showActionButton() {
      if (this.noActionButton) return false
      return !!this.value
    },
    actionButtonIcon() {
      if (this.actionIcon !== null) return this.actionIcon
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
        && !this.initial
        && this.camelCaseName in this.validation.errors 
        && this.validation.errors[this.camelCaseName].length > 0
      )
    },
    camelCaseName() {
      return this.dName.replace(
        /([-_][a-z])/g,
        (group) => group.toUpperCase()
                        .replace('-', '')
                        .replace('_', '')
      )
    }
  },
  methods: {
    clearField() {
      this.$el.querySelector('input, textarea').value = ''
      this.$emit('input', '')
    },
    togglePasswordVisibility() {
      this.passwordShown = !this.passwordShown
    },
    action($event) {
      if (this.actionIcon)
        this.$emit('action', $event);
      if (this.type === 'password')
        this.togglePasswordVisibility()
      else
        this.clearField()
    },
    toJSValue(value) {
      if (value === null) {
        return null
      }
      switch (this.type) {
        case 'date':
          value = parseISO(value)
          break;
      
        case 'number':
          value = Number(value)
          break;
      }
      return value
    },
    toHTMLValue(value) {
      if (value === null) return null
      switch (this.type) {
        case 'date':
          value = formatISO(value, { representation: "date" })
          break;
      
        case 'number':
          value = Number(value)
          break;
      }
      return value
    }
  }
}
</script>

<style lang="stylus" scoped>
// === Vars
side-padding = 15px
stroke-thickness = 2px
errors-space = 2em
// === Setup
.field
  // Used for the label's absolute positionning
  position relative
  // The label goes outside the bounding box and will potentially overlap with stuff around the field if we don't do this
  &.has-label
    padding-top calc(1em + 3px)
  // Leave some space for errors
.field-inner
  // Vertically center the action button
  display flex
  align-items center
  // Make it take the height of the parent element
  height 100%
.input
  // Let the input take the whole .inner-field width
  width 100% 
// === Typography
label
  text-transform uppercase
  letter-spacing 1px
  font-size 0.75em
  font-weight 500
// === Passive state
.input
  // LAYOUT
  min-width 250px
  &[type=number]
    min-width 50px
  padding 15px (side-padding)
  padding-right (side-padding * 2 + 10px)
  // LOOKS
  background transparent
  border (stroke-thickness) solid var(--grey-dark)
  border-radius var(--border-radius)
  color var(--black)
textarea
  height 100%
label
  position absolute
  left 5px
  padding 0 5px
  top 0px
  background transparent
// === Hover state
.input:hover, .input:focus
  &
    border-color var(--black)
    outline none
  & + label
    left 10px
// === Active state
.active
  label
    top 15px
    left 10px
    color var(--blue)
  .input
    border-color var(--blue)
// === Errored state
.field.errored:not(.active)
  label
    color var(--red)
  .input
    border-color var(--red)
// === Filled state
:not(.active).field.filled label
  color var(--grey-dark)
// === Disabled state
.field.disabled
  .input
    background var(--grey)
    pointer-events none
  label
    opacity: 0.25
// === Interactions
.input
  transition all .25s ease
label
  transition left .125s ease,
             top .125s ease,
             color .25s ease,
             background .01s ease
.action:not(.always-show)
  display none
.field:hover, .field.active
  .action
    display block
// === Other elements
.action
  position absolute
  right: (side-padding)
  z-index: 2
  color var(--black)
// Align action button to top-left for type=block
.type-block .action
  top: 32px //FIXME: Pixel-perfect value
// Remove type=date or type=time native clear button
/* WARN: Does *not* work on Firefox.
 * Another solution would be to set the date to required, but
 * that would render our custom clear btn pointless...
 * Though, this issue would be gone once the custom date & time pickers are
 * implemented, as the date/time inputs will be of text type anyways
 * I know this is bad for semantics, but the date/time input types
 * do not offer enough customisability. (especially on FF)
 */
input[type="time"]::-webkit-clear-button
input[type="date"]::-webkit-clear-button
  display none

.error
  text-align: center
  color var(--red)
  font-size: 0.85em
  margin-top: 0.45em
  flex-grow: 0
  height (errors-space)
  overflow-y hidden

/* Background variant
 *
 */
.variant-filled
  // === Passive state
  .input
    background var(--grey-offset)
    border 2px solid transparent
  // === Hover state
  .input:hover, .input:active
    background transparent
    border 2px solid var(--grey-dark)
  // === Active state
  &.active .input
    background transparent
    border 2px solid var(--blue)
</style>
