<template lang="pug">
    .Checkbox
        input(
            type="checkbox"
            @change="change"
            :checked="checked"
            :id="`checkbox--${id}`"
            :name="id"
        )
        label(:for="`checkbox--${id}`")
            slot
</template>

<script>
import slugify from 'slugify'

export default {
    data() {
        return {
            checked: this.value,
        }
    },
    computed: {
        id() {
            const label = this.$slots.default[0].text
            return slugify(label).toLowerCase()
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        change() {
            this.checked = !this.checked
            this.$emit('input', this.checked)
        }
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
label::before
    content 'check'
    display flex
    align-items center
    text-align center
    vertical-align middle
    font-family 'Material Icons'
    height 1.15em
    width 1.15em
    border 2px solid black
    border-radius 2.5px
    margin-right 0.5em
    color transparent
.Checkbox
    display flex
    align-items center
input:checked + label::before
    background #000
    color white
input[disabled] + label
    opacity: 0.5
</style>
