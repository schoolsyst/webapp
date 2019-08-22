<template lang="pug">
div.BarFloating
    slot
</template>

<script>

export default {
    name: 'BarFloating',
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

//TODO: pushed down effect when clicked
.BarFloating
    // # self
    // ## positioning
    position: fixed
    bottom: 40px
    transform: translateX(-50%)
    // ## dimensions
    left: 50%
    // ## margins
    padding: 15px 40px
    // ## appearance
    background: var(--blue)
    $transparent-blue: transparentize($blue, 0.75)
    box-shadow: 10px 10px 0 $transparent-blue
    // # contents
    // ## positioning
    display: flex
    justify-content: center
    align-items: center
.BarFloating /deep/ .ButtonIcon
    // ## margins
    &:not(:last-child)
        margin-right: 60px
    // ## dimensions
    height: 40px
    i
        font-size: 35px
        // ## appearance
        color: #ffffff
</style>