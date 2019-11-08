<template lang="pug">
button.ButtonReg(
  :class="role"
  :disabled="disabled"
  @click="$emit('click')" 
)
    i.icon.material-icons-outlined(v-if="icon") {{icon}}
    span.text: slot
</template>

<script>
export default {
  name: "ButtonReg",
  props: {
    role: {
      type: String,
      default: "primary",
    },
    icon: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style lang="stylus" scoped>
button
    display: flex
    justify-content center
    align-items: center
    border-radius 7.5px
    padding: 0 25px
    font-size: 1.5rem
    height: 60px
    .icon
      margin-right: 0.5rem
button[disabled]
    opacity: 0.5
    cursor default
    pointer-events none
button.secondary
    background-color: var(--offset-blue)
    color: var(--blue)
    &:hover
      background-color: var(--offset-blue-dark)
      // color: #ffffff
button.primary
    background-color: var(--blue)
    color: #ffffff
    &:hover
      background-color: var(--blue-dark)
button.danger
    background-color: var(--red)
    color: #ffffff
    &:hover
      color: var(--offset-red)
</style>
