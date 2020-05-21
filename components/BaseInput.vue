<template>
  <div class="--base-input">
    <label :for="inputId"><slot></slot></label>
    <component
      :is="element"
      :id="inputId"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :aria-placeholder="placeholder"
      v-bind="inputAttrs"
    ></component>
    <ul v-if="errors">
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
import { isIn } from '~/utils/validators'
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

export default Vue.extend({
  props: {
    element: {
      type: String,
      default: 'input',
      validator: isIn(['input', 'textarea']),
    } as PropOptions<'input' | 'textarea'>,
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
  },
  computed: {
    inputId(): string {
      return `input--${name}`
    },
  },
})
</script>

<style lang="stylus" scoped>
//
// Definitions
//



//
// Positioning
//



//
// Sizing
//



//
// Spacing
//



//
// Decoration
//



//
// Colors
//



//
// Typography
//



//
// States
//
</style>
