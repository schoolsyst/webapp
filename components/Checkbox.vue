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
            Icon.checkmark check
            slot
</template>

<script>
import slugify from 'slugify'
import Icon from '~/components/Icon.vue'
export default {
    components: { Icon },
    data() {
        return {
            checked: this.value,
        }
    },
    computed: {
        id() {
            const label = this.$slots.default ? this.$slots.default[0].text : ""
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
checkbox-size = 1.15em

input
    display none
label
    height: checkbox-size
    display flex
    align-items center
    cursor pointer
    position relative
label::before
    content ''
    display flex
    align-items center
    text-align center
    vertical-align middle
    font-family 'Material Icons'
    height checkbox-size
    width checkbox-size
    border 2px solid black
    border-radius 2.5px
    margin-right 0.5em
    color transparent
    transition all 0.125s ease
.Checkbox
    display flex
    align-items center
.checkmark
    position absolute
    color var(--white)
    font-size: 1em
    height checkbox-size
    width checkbox-size
    text-align center
    transform scale(0)

input:checked 
    & + label::before
        border-width "calc(%s / 2)" % checkbox-size
    & + label .checkmark
        transform scale(1)
        transition transform 0.125s ease 0.125s
input[disabled] + label
    opacity: 0.5
</style>
