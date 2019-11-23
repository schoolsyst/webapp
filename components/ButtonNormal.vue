<template lang="pug">
    //TODO: popup w/ errors
    button.btn(
        :type="type"
        :class="`btn--${variant} ${small ? 'small' : ''}`"
        :disabled="disabled || !v.validated"
        :title="!v.validated ? Object.values(v.errors).join(', ') : false"
        @click="$emit('click')"
    ): slot
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
            // validate: (v) => ["primary", "outline", "secondary"].includes(v)
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
        }
    },
    computed: {
        v() {
            if (this.validation === null) 
                return { validated: true, errors: {} }
            return this.validation
        }
    }
}
</script>

<style lang="stylus" scoped>
.btn
    // display inline
    margin 0 5px
    padding 15px 20px
    font-size: 1.05em
    &.small
        font-size: 0.85em
        margin 0 1.5em
    border-radius 5px
    display flex-inline
    justify-content center
    align-items center
    &[disabled]
        cursor not-allowed
.btn--outline
    border 2px solid var(--blue)
    color var(--blue)
    &:hover, &:focus
        background-color var(--blue)
        color white
    &:active
        background-color var(--blue-dark)
    &[disabled]
        color #00000055
        border-color #00000055
        background transparent
.btn--primary
    background-color var(--blue)
    color white
    &:hover, &:focus
        background-color var(--blue-dark)
    &:active
        color rgba(255,255,255,0.25)
    &[disabled]
        background #00000033
        color #00000088
.btn--secondary
    background-color var(--offset-blue)
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
        border 2px solid rgba(0,0,0,0.25)
</style>
