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
      const label = this.$slots.default ? this.$slots.default[0].text : ''
      return slugify(label).toLowerCase()
    },
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    change() {
      this.checked = !this.checked
      this.$emit('input', this.checked)
    },
  },
}
</script>

<style lang="stylus" scoped>
checkbox-size = 1.15em

input
  display none

label
  position relative
  display flex
  align-items center
  height checkbox-size
  cursor pointer

label::before
  display flex
  align-items center
  margin-right 0.5em
  width checkbox-size
  height checkbox-size
  border 2px solid var(--black)
  border-radius 2.5px
  color transparent
  content ''
  vertical-align middle
  text-align center
  font-family 'Material Icons'
  transition all 0.125s ease

.Checkbox
  display flex
  align-items center

.checkmark
  position absolute
  width checkbox-size
  height checkbox-size
  color var(--white)
  text-align center
  font-size 1em
  transform scale(0)

input:checked
  & + label::before
    border-width 'calc(%s / 2)' % checkbox-size

  & + label .checkmark
    transition transform 0.125s ease 0.125s
    transform scale(1)

input[disabled] + label
  opacity 0.5
</style>
