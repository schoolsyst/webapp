<template lang="pug">
    button.ButtonFloating(@click="$emit('click', $event)")
        i.icon(:class="iconClass") {{icon}}
        slot
</template>

<script>
export default {
  name: "ButtonFloating",
  props: {
    icon: String,
    iconStyle: String,
  },

  computed: {
    iconClass() {
      return (
        "material-icons" + (this.iconStyle === "baseline" ? "" : "-outlined")
      )
    },
  },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.ButtonFloating
    $height: 3.5rem
    // self-positionning
    position: fixed
    +desktop
        right: 50px
        bottom: 50px
    +mobile
        right: 25px
        bottom: 125px
    // inner items positionning
    padding-left: $height / 2 - 1rem
    padding-right: $height / 2
    height: $height
    display: flex
    justify-content: center
    align-items: center
    // button appearance
    border-radius: $height / 2
    background: var(--blue)
    transition: box-shadow 0.25s ease
    +shadow(4)
    &:focus, &:hover
        outline: none
        +shadow(5)
    // inner items appearance
    color: white
    font-size: 1.2rem
    font-weight: normal
    z-index: 100


.icon
    font-size: 2rem
    margin-right: .5rem

</style>
