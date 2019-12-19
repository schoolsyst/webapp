<template lang="pug">
    fieldset.RadioButtons
        legend: slot
        .RadioButton(v-for="value in values" :key="value.key")
            input(
                @change="$emit('input', value.key)"
                type="radio"
                :id="`radio--${id}--${slugify(value.key)}`"
                :name="id"
                :value="value.key"
                :selected="value.key === defaultValue"
            )
            label(:for="`radio--${id}--${slugify(value.key)}`") {{value.label}}
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
        defaultValue: {
            type: String,
            default: null
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
        defaultSelection() {
            const idx = this.defaultValue 
                ? this.values.map((o) => o.key).indexOf(this.defaultValue)
                : 0
            return this.values[idx].key
        }
    },
    methods: {
        slugify
    }
}
</script>

<style lang="stylus" scoped>
input
    display none
label
    height: 1.15em
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
    height 1.15em
    width 1.15em
    border 2px solid var(--black)
    border-radius 50%
    margin-right 0.25rem
.RadioButton
    display flex
    align-items center
    margin-right: 1rem
fieldset
    display flex
    border 2px solid var(--grey-dark)
    // padding 0.75em 0.625em
    border-radius 2.5px
    
legend
    padding 0 10px
    text-transform uppercase
    letter-spacing 1px
    font-size 0.75em
    font-weight 500
input:checked + label::before
    background var(--black)
    color var(--white)
input[disabled] + label
    opacity: 0.5
</style>
