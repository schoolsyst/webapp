<template lang="pug">
    //TODO: merge w/ <InputSelect>, choose radio buttons based on choices.length, prop to force radio/select
    //TODO: fix margins (between checkboxes, comply with error-messages on <InputField>)
    fieldset.RadioButtons(:class="{[`variant-${variant}`]: true, vertical}")
        legend: slot
        .RadioButton(v-for="choice in choices" :key="choice.key")
            input(
                @change="$emit('input', choice.key)"
                type="radio"
                :id="`radio--${id}--${slugify(choice.key.toString())}`"
                :name="id"
                :value="choice.key"
                :checked="choice.key === value"
            )
            label(:for="`radio--${id}--${slugify(choice.key.toString())}`") {{choice.label}}
</template>

<script>
import slugify from 'slugify'

export default {
    props: {
        name: {
            type: String,
            required: true
        },
        values: {
            type: Array,
            default: () => ([])
        },
        value: {
            default: null
        },
        variant: String,
        vertical: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            checked: this.value,
        }
    },
    computed: {
        id() {
            const label = this.$slots.default[0].text
            return slugify(label).toLowerCase()
        },
        choices() {
            if (typeof this.values[0] !== 'object') {
                return this.values.map(v => ({ key: v, label: v }))
            } else {
                return this.values
            }
        }
    },
    methods: {
        slugify
    }
}
</script>

<style lang="stylus" scoped>
size = 1.15em

input
    display none
label
    height: (size)
    display flex
    align-items center
    flex-shrink 0
label::before
    content ''
    display flex
    text-align center
    align-items center
    font-family 'Material Icons'
    display inline-block
    height (size)
    width (size)
    border-style solid
    border-width "calc(%s / 8)" % size
    border-color var(--grey-dark)
    border-radius 50%
    transition all 0.125s ease
    margin-right 0.25rem
    // Fix the vertical alignement (might be because of the font 'Now')
    margin-bottom: .125em
.RadioButton
    display inline-flex
    align-items center
    margin-right: 1rem
fieldset
    display flex
    border 2px solid var(--grey-dark)
    // padding 0.75em 0.625em
    border-radius var(--border-radius)
    flex-wrap wrap
fieldset.vertical
    flex-direction column
    .RadioButton
        margin-bottom .7em
    .RadioButton:first-of-type
        margin-top: 0.5rem

legend
    padding 0 10px
    text-transform uppercase
    letter-spacing 1px
    font-size 0.75em
    font-weight 500
input:hover + label::before
    border-color var(--black)
input:checked + label::before
    border-width "calc(%s / 2)" % size
    border-color var(--black)
input[disabled] + label
    opacity: 0.5
input, label
    cursor pointer

/* Filled variant
 */
fieldset
    border-color var(--grey-offset)
</style>
