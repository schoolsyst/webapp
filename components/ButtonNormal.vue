<template lang="pug">
    button.btn(
        :type="type"
        :class="`btn--${variant}`"
        :disabled="disabled || !validated"
        :title="!validated ? message : false"
    ): slot
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: "submit"
        },
        variant: {
            type: String,
            default: "outline",
            // validate: (v) => ["primary", "outline", "secondary"].includes(v)
        },
        validation: {
            type: Object,
            default: () => ({
                validated: true,
                message: null
            })
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            validated: this.validation.validated,
            message: this.validation.message
        }
    }
}
</script>

<style lang="stylus" scoped>
.btn
    padding 15px 20px
    border-radius 5px
    font-size: 1.05em
    display flex
    justify-content center
    align-items center
.btn--outline
    border 2px solid var(--blue)
    color var(--blue)
    &:hover, &:focus
        background-color var(--blue)
        color white
    &:active
        background-color var(--blue-dark)
.btn--primary
    background-color var(--blue)
    color white
    &:hover, &:focus
        background-color var(--blue-dark)
    &:active
        color rgba(255,255,255,0.25)
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
