<template>
  <div
    :class="{
      '--base-input': true,
      'has-label': hasALabel,
      focused,
      errored: errors.length > 0,
    }"
  >
    <label v-if="hasALabel" :for="inputId"><slot></slot></label>
    <!-- <p v-if="readonly" class="readonly-input">{{ value }}</p> -->
    <component
      :is="element"
      :id="inputId"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :aria-placeholder="placeholder"
      :value="value"
      :readonly="readonly"
      :class="{ input: true, resizable: inputAttrs && inputAttrs.resizable }"
      v-bind="inputAttrs"
      @focus="focused = true"
      @blur="focused = false"
      @input="$emit('input', $event.target.value)"
      >{{ value }}</component
    >
    <ul v-if="errors.length > 0" class="errors">
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
type HTMLInputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'

type HTMLInputElement =
  | 'input'
  | 'textarea'
  | 'multiselect'
  | 'progress'
  | 'meter'
  | 'output'
  | 'fieldset'

export default Vue.extend({
  props: {
    element: {
      type: String,
      default: 'input',
    } as PropOptions<HTMLInputElement>,
    type: {
      type: String,
      default: 'text',
    } as PropOptions<HTMLInputType>,
    placeholder: {
      type: String,
      default: null,
    } as PropOptions<null | string>,
    name: {
      type: String,
      required: true,
    } as PropOptions<string>,
    value: {
      type: [String, Number, Boolean],
      default: null,
    } as PropOptions<null | string | number | boolean>,
    errors: {
      type: Array,
      default: () => [],
    } as PropOptions<string[]>,
    inputAttrs: {
      type: Object,
      default: () => ({}),
    } as PropOptions<Record<string, string | null | boolean>>,
    disabled: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    readonly: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
  },
  data() {
    return {
      focused: false,
    }
  },
  computed: {
    inputId(): string {
      return `input--${this.name}`
    },
    hasALabel(): boolean {
      return Boolean(this.$slots?.default?.[0]?.text)
    },
  },
})
</script>

<style lang="stylus" scoped>
//
//Definitions
//
label-passive-offset-y = 1em
border-width = 1.5px

//
//Positioning
//
.--base-input
  position relative
  display flex
  flex-direction column

label
  position absolute
  top -(label-passive-offset-y + 0.5)
  left 0

//
//Sizing
//
.input
  width 100%
  height 100%

//
//Spacing
//
.input, .readonly-input
  padding 0.5em

//Make more vertical room for label
.--base-input.has-label .input
  padding 0.8em

label
  padding 0 0.5em

.errors
  margin-top 0.5em

//
//Decoration
//
.input
  border border-width solid
  border-radius var(--border-radius)

//
//Colors
//
.input
  border-color var(--grey-dark)
  color inherit

.errors
  color var(--red)

//
//Typography
//
label
  text-transform uppercase
  letter-spacing 1px
  font-weight 500
  font-size 0.75em

.errors li::before
  content '– '

//
//Hacks
//
label
  background-color var(--white)

//Make room for the label, since position:absolute doesn't make any
.--base-input.has-label
  margin-top label-passive-offset-y

//
//Reactions
//
label
  //transition left 0.125s ease, top 0.125s ease, color 0.25s ease
  transition all 250ms ease

.--base-input:hover, .--base-input.focused
  label
    left 1em

.--base-input.focused
  label
    top -0.5em
    color var(--blue)

  .input
    border-color var(--blue)

.--base-input.errored
  label
    color var(--red)

.--base-input.errored.focused
  .input
    border-color var(--red)

.--base-input .input[readonly]
  border-color transparent

.--base-input .input:not(.resizable)
  resize none
</style>
