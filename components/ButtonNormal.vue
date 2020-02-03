<template lang="pug">
    //TODO: popup w/ errors
    //TODO: https://stackoverflow.com/questions/31402576/enable-focus-only-on-keyboard-use-or-tab-press
    //TODO: Rename this component
    .button
        component.btn(
            :is="href ? (externalHref ? 'a' : 'nuxt-link') : 'button'"
            :to="href && !externalHref ? href : false"
            :href="externalHref ? href : false"
            :target="externalHref && !inPlace ? '_blank' : false"
            v-bind="{ type, role }"
            :class="{[`btn--${variant}`]: true, small, smaller}"
            :disabled="disabled || !v.validated"
            v-tooltip="validationErrors"
            @click="!href ? $emit('click') : ''"
            no-default
        )
            slot
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'button'
    },
    variant: {
      type: String,
      default: 'outline'
      // validator: (v) => ["primary", "outline", "secondary"].includes(v)
    },
    validation: {
      type: Object,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    smaller: {
      type: Boolean,
      default: false
    },
    href: {
      type: String,
      default: null
    },
    role: {
      type: String,
      default: null
    },
    inPlace: {
      // Open external links in-place
      type: Boolean,
      default: false
    }
  },
  computed: {
    v() {
      if (this.validation === null) return { validated: true, errors: {} }
      return this.validation
    },
    validationErrors() {
      if (this.v.validated) return false
      return (
        '<ul class="default-styles" style="padding-left:1em;text-align:left">' +
        Object.values(this.v.errors)
          .filter((v) => v.length)
          .map((v) => '<li>' + v[0] + '</li>')
          .join('') +
        '</ul>'
      )
    },
    externalHref() {
      return this.href && /^https?:\/\//.test(this.href)
    }
  }
}
</script>

<style lang="stylus" scoped>
.button
  display: inline-block

.btn
  -webkit-appearance: none
  appearance: none
  transition: all 0.125s ease
  margin: 0 5px
  padding: 15px 20px
  font-size: 1.05em
  display: flex

  &.small, &.smaller
    font-size: 0.9em
    margin: 0 1.5em
    display: inline-flex

  &.small
    padding: 0.75em 1em

  &.smaller
    padding: 0.5em 0.8em

  border-radius: var(--border-radius)
  justify-content: center
  align-items: center
  text-align: center

  &[disabled]
    cursor: not-allowed

  & /deep/ i
    margin-right: 0.2em
    font-size: 1.3em

.btn--outline
  border: 2px solid var(--grey)
  color: var(--blue)
  &[role=danger]
    color var(--red)

  &:hover, &:focus
    background-color: transparent
    border-color: var(--blue)
    &[role=danger]
      background-color: transparent
      border-color: var(--red)

  &:active
    background-color: var(--blue-offset)
    border-color: var(--blue-offset)
    color: var(--blue-dark)
    &[role=danger]
      background-color: var(--red)
      border-color: var(--red)
      color: white

  &[disabled]
    color: var(--grey)
    border-color: var(--grey)
    background: transparent

.btn--primary
  background-color: var(--blue)
  border: 2px solid var(--blue)
  color: white
  &[role=danger]
    background-color: var(--red)
    border: 2px solid var(--red)


  &:hover, &:focus
    background-color: var(--blue-dark)
    border: 2px solid var(--blue-dark)
    &[role=danger]
      background-color: var(--red-dark)
      border: 2px solid var(--red-dark)

  &:active
    color: rgba(255, 255, 255, 0.25)

  &[disabled]
    background: var(--grey-offset)
    border: 2px solid var(--grey-offset)
    color: var(--grey-dark)

.btn--secondary
  background-color: var(--blue-offset)
  border: 2px solid var(--blue-offset)
  color: var(--blue)

  &:hover, &:focus
    background-color: var(--blue)
    border: 2px solid var(--blue)
    color: white

  &:active
    background-color: var(--blue-dark)
    border: 2px solid var(--blue-dark)

.btn--text
  background-color: transparent
  border: 2px solid transparent
  color: black

  &:hover, &:focus
    border: 2px solid var(--grey-light)

.btn--flat
  padding: 10px 0
  margin: 0
  text-transform: uppercase
  letter-spacing: 0.125em
  font-weight: bold
  color: var(--blue)

  &:hover, &:focus
    color: var(--blue-dark)

  & /deep/ i
    margin-bottom: 0.15em // vertical centering

.btn--text-blue
  padding: 0
  background-color: transparent
  color: var(--blue)
  font-size: 1.2em

  &:hover, &:focus
    color: var(--blue-dark)
</style>
