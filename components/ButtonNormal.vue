<template lang="pug">
    //TODO: popup w/ errors
    //TODO: https://stackoverflow.com/questions/31402576/enable-focus-only-on-keyboard-use-or-tab-press
    //TODO: Rename this component
    .button
        component.btn(
            :is="href ? 'nuxt-link' : 'button'"
            :to="href ? href : ''"
            :type="type"
            :class="{[`btn--${variant}`]: true, small, smaller}"
            :disabled="disabled || !v.validated"
            :title="title"
            @click="!href ? $emit('click') : ''"
        )
            slot
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: ""
        },
        variant: {
            type: String,
            default: "outline",
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
        }
    },
    computed: {
        v() {
            if (this.validation === null) 
                return { validated: true, errors: {} }
            return this.validation
        },
        title() {
            if (this.v.validated) return false
            return (
                Object.values(this.v.errors)
                .filter((v) => v.length)
                .map((v) => v[0])
                .join('\n')
            )
        }
    }
}
</script>

<style lang="stylus" scoped>
.button
    display inline-block
.btn
    transition all 0.125s ease
    margin 0 5px
    padding 15px 20px
    font-size: 1.05em
    display flex
    &.small, &.smaller
        font-size: 0.9em
        margin 0 1.5em
        display inline-flex
    &.small
        padding 13px 18px
    &.smaller
        padding .75em .8em
    border-radius var(--border-radius)
    justify-content center
    align-items center
    text-align center
    &[disabled]
        cursor not-allowed
    & /deep/ i
        margin-right 0.2em
        font-size 1.3em
.btn--outline
    border 2px solid var(--blue)
    color var(--blue)
    &:hover, &:focus
        background-color var(--blue)
        color white
    &:active
        background-color var(--blue-dark)
        border-color var(--blue-dark)
    &[disabled]
        color var(--grey)
        border-color var(--grey)
        background transparent
.btn--primary
    background-color var(--blue)
    color white
    &:hover, &:focus
        background-color var(--blue-dark)
    &:active
        color rgba(255,255,255,0.25)
    &[disabled]
        background var(--grey-offset)
        color var(--grey-dark)
.btn--secondary
    background-color var(--blue-offset)
    color var(--blue)
    &:hover, &:focus
        background-color var(--blue)
        color white
    &:active
        background-color var(--blue-dark)
.btn--text
    background-color transparent
    border 2px solid transparent
    color black
    &:hover, &:focus
        border 2px solid var(--grey-light)
.btn--flat
    padding 10px 0
    margin: 0
    text-transform uppercase
    letter-spacing: .125em
    font-weight bold
    color var(--blue)
    &:hover, &:focus
        color var(--blue-dark)
    & /deep/ i
        margin-bottom: 0.15em //vertical centering
</style>
