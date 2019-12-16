<template lang="pug">
  .field(
    :class="{active, errored, filled: !!value, 'has-label': !noLabel, [`variant-${variant}`]: true, disabled}"
    :name="dName"
    :data-variant="variant"
  )
    .field-inner
      button.action(
        v-if="showActionButton"
        @click.prevent="action()"
        tabindex="-1"
      )
        i.material-icons-outlined {{actionButtonIcon}}
      input(
        :name="dName"
        :type="passwordShown ? 'text' : type"
        :id="`input-field--${dName}`"
        :style="{fontFamily: `var(--fonts-${passwordShown ? 'monospace' : 'regular'}`}"
        v-bind="{value, tabindex, placeholder, disabled}"
        @input="active = true; initial = false; $emit('input', $event.target.value)"
        @click="active = true; $emit('click', $event.target.value)"
        @blur="active = false; passwordShown = false; $emit('blur', $event.target.value)"
        @mouseover="$emit('mouseover', $event.target.value)"
        @mouseout="$emit('mouseout', $event.target.value)"
      )
      label(
        :for="`input-field--${dName}`"
        :style="`background: ${active ? backgroundColor : 'transparent'};`"
      )
        slot
    p.error(v-if="!noErrorMessages") {{errored ? validation.errors[camelCaseName][0] : ""}}
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
    noActionButton: {
      type: Boolean,
      default: false
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
stroke-thickness = 2px
errors-space = 2em
// ==== Setup
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
input
  // Let the input take the whole .inner-field width
  width 100% 
// ==== Typography
label
  text-transform uppercase
  letter-spacing 1px
  font-size 0.75em
  font-weight 500
// ===== Passive state
input
  // LAYOUT
  min-width 250px
  &[type=number]
    min-width 50px
  padding 15px side-padding
  padding-right (side-padding * 2 + 10px)
  // LOOKS
  background transparent
  border (stroke-thickness) solid var(--grey-dark)
  border-radius var(--border-radius)
  color var(--black)
label
  position absolute
  left 5px
  padding 0 5px
  top 0px
  background transparent
// ===== Hover state
input:hover, input:focus
  &
    border-color var(--black)
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
:not(.active).field.filled label
  color var(--grey-dark)
// ===== Disabled state
.field.disabled
  input
    background var(--grey)
    pointer-events none
  label
    opacity: 0.25
// ===== Interactions
input
  transition all .25s ease
label
  transition left .125s ease,
             top .125s ease,
             color .25s ease,
             background .01s ease
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
  color var(--black)
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
  //==== Passive state
  input
    background var(--grey-offset)
    border 2px solid transparent
  //==== Hover state
  input:hover, input:active
    background transparent
    border 2px solid var(--grey-dark)
  //==== Active state
  &.active input
    background transparent
    border 2px solid var(--blue)
</style>
