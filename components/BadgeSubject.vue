<template lang="pug">
button.BadgeSubject(:style="{backgroundColor: color, color: textColor}" :title="name" @click="$emit('click')") {{abbreviation}}
</template>

<script>
import chroma from 'chroma-js'
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
        },
        name: {
            type: String,
            default() { return this.abbreviation === '...' ? 'Choisissez une matière...' : this.abbreviation }
        }
    },
    computed: {
        textColor() {
            return chroma(this.color).get('lab.l') < 70 ? 'white' : 'black'
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
    white-space: nowrap
    justify-content: center
    align-items: center
    text-transform: uppercase
    &:focus, &:hover
        outline: none
        opacity: 0.75
</style>