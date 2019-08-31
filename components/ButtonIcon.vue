<template lang="pug">
button.IconButton(@click="$emit('click')")
    i.material-icons-outlined.icon(:style="{color: color}")
        slot
</template>

<script>

export default {
    name: 'IconButton',
    props: {
        color: {
            type: String,
            default: 'white'
        }
    }
}
</script>

<style lang="stylus" scoped>
.icon
    font-size: 36px
.icon:hover, .icon:focus
    font-family 'Material Icons'
    outline none
</style>