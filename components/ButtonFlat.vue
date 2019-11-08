<template lang="pug">
  button.ButtonFlat(@click="$emit('click')" :data-icon-style="iconStyle" :class="role")
    i.icon(:class="iconStyle === 'outlined' ? 'material-icons-outlined' : 'material-icons'" v-if="icon") {{icon}}
    span.text: slot
</template>

<script>
export default {
  name: "ButtonFlat",

  props: {
    icon: String,
    iconStyle: {
      type: String,
      default: "outlined",
    },
    role: String
  }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.ButtonFlat
    font-size: 1.5rem
    font-weight: bold
    letter-spacing: 1.5px
    display: flex
    align-items: center
    text-transform: uppercase
    color: var(--blue)
    &.danger
      color: var(--red)

.icon
    margin-right: 0.5rem

.ButtonFlat:hover
    outline-color: transparent
    color: var(--blue-light)
    &.danger
      color: var(--red-light)

.ButtonFlat[disabled]
    opacity: 0.25
    pointer-events: none


</style>
