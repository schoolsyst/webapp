<template lang="pug">
button.BadgeSubject(:style="{backgroundColor: color}") {{abbreviation}}
</template>

<script>

export default {
    name: 'BadgeSubject',
    props: {
        abbreviation: {
            type:String,
            default:'...'
        },
        color: {
            type:String,
            default:'#000000'
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.BadgeSubject
    width: 100px
    height: 50px
    font-family: 'Roboto Mono', monospace
    font-size: 30px
    padding: 10px 15px
    border-radius: 10px
    color: #fff
    display: flex
    justify-content: center
    align-items: center
    text-transform: uppercase
    &:focus, &:hover
        opacity: 0.75
</style>