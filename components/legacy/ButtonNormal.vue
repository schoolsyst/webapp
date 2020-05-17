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
      default: 'button',
    },
    variant: {
      type: String,
      default: 'outline',
      // validator: (v) => ["primary", "outline", "secondary"].includes(v)
    },
    validation: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    smaller: {
      type: Boolean,
      default: false,
    },
    href: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: null,
    },
    inPlace: {
      // Open external links in-place
      type: Boolean,
      default: false,
    },
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
          .filter(v => v.length)
          .map(v => '<li>' + v[0] + '</li>')
          .join('') +
        '</ul>'
      )
    },
    externalHref() {
      return this.href && /^https?:\/\//.test(this.href)
    },
  },
}
</script>

<style lang="stylus" scoped>
.button
  display inline-block

.btn
  display flex
  margin 0 5px
  padding 15px 20px
  font-size 1.05em
  transition all 0.125s ease
  -webkit-appearance none
  appearance none

  &.small, &.smaller
    display inline-flex
    margin 0 1.5em
    font-size 0.9em

  &.small
    padding 0.75em 1em

  &.smaller
    padding 0.5em 0.8em

  justify-content center
  align-items center
  border-radius var(--border-radius)
  text-align center

  &[disabled]
    cursor not-allowed

  & /deep/ i
    margin-right 0.2em
    font-size 1.3em

.btn--outline
  border 2px solid var(--grey)
  color var(--blue)

  &[role=danger]
    color var(--red)

  &:hover, &:focus
    border-color var(--blue)
    background-color transparent

    &[role=danger]
      border-color var(--red)
      background-color transparent

  &:active
    border-color var(--blue-offset)
    background-color var(--blue-offset)
    color var(--blue-dark)

    &[role=danger]
      border-color var(--red)
      background-color var(--red)
      color white

  &[disabled]
    border-color var(--grey)
    background transparent
    color var(--grey)

.btn--primary
  border 2px solid var(--blue)
  background-color var(--blue)
  color white

  &[role=danger]
    border 2px solid var(--red)
    background-color var(--red)

  &:hover, &:focus
    border 2px solid var(--blue-dark)
    background-color var(--blue-dark)

    &[role=danger]
      border 2px solid var(--red-dark)
      background-color var(--red-dark)

  &:active
    color rgba(255, 255, 255, 0.25)

  &[disabled]
    border 2px solid var(--grey-offset)
    background var(--grey-offset)
    color var(--grey-dark)

.btn--secondary
  border 2px solid var(--blue-offset)
  background-color var(--blue-offset)
  color var(--blue)

  &:hover, &:focus
    border 2px solid var(--blue)
    background-color var(--blue)
    color white

  &:active
    border 2px solid var(--blue-dark)
    background-color var(--blue-dark)

.btn--text
  border 2px solid transparent
  background-color transparent
  color black

  &:hover, &:focus
    border 2px solid var(--grey-light)

.btn--flat
  margin 0
  padding 10px 0
  color var(--blue)
  text-transform uppercase
  letter-spacing 0.125em
  font-weight bold

  &:hover, &:focus
    color var(--blue-dark)

  & /deep/ i
    margin-bottom 0.15em //vertical centering

.btn--text-blue
  padding 0
  background-color transparent
  color var(--blue)
  font-size 1.2em

  &:hover, &:focus
    color var(--blue-dark)
</style>
