<template lang="pug">
button.BaseButtonReg(:type="type" @click="$emit('click')")
    slot
</template>

<script>
export default {
  name: "BaseButtonReg",
  props: {
      type: String
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
+material-icons
        
.BaseButtonReg
    text-align: center
    border-radius: 7.5px
    padding: 20px 25px
    min-width: 150px
    font-size: 24px
    margin-right: 10px
    &::before
        right: 0
        content: 'chevron_right'
    &::after
        left: 0
        content: 'chevron_left'
    &::after, &::before
        @extend .material-icons
        font-size: 1em
        position: relative
        top: .1em
        opacity: 0
        transition: all .25s ease

.BaseButtonReg:hover, .BaseButtonReg:focus
    outline: none
    &::before, &::after
        opacity: 1
    &::before
        right: 5px
    &::after
        left: 5px
</style>