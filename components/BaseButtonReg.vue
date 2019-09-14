<template lang="pug">
button.BaseButtonReg(:type="type" @click="$emit('click')")
    i.material-icons-outlined.icon(v-if="icon") {{icon}}
    slot
</template>

<script>
export default {
  name: "BaseButtonReg",
  props: {
    type: String,
    icon: String
  },
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
+material-icons
        
.BaseButtonReg
    display: flex
    justify-content: center
    align-items: center
    border-radius: 7.5px
    +desktop
        padding: 25px 30px
    +mobile
        padding: 22px
    min-width: 150px
    // max-height: 50px
    font-size: 20px
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
    .icon
        font-family: 'Material Icons'

.icon
    margin-right: 5px
</style>