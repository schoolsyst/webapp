<template lang="pug">
    #topbar.topbar(:class="{scrolled}")
        button.open-drawer(@click="$emit('menu-click')"): Icon menu
        .centered
            InputField.search(
                variant="filled"
                title="Le \"quick switcher\" arrive bientôt !"
                no-error-messages 
                no-label
                disabled
                v-model="searchText"
                @click="searchBarFocused = true"
                @blur="searchBarFocused = false"
                @mouseover="searchBarHovered = true"
                @mouseout="searchBarHovered = false"
                name="quick-switcher"
                :style={opacity:0}
            )
            .logo(:style="{opacity: !searchBarHovered && !searchBarFocused ? '1' : '0'}"): img(src="/logos/compound.svg")
</template>

<script>
import Icon from '~/components/Icon.vue'
import InputField from '~/components/InputField.vue'

export default {
    components: { Icon, InputField },
    data() {
        return {
            searchText: "",
            scrolled: false,
            searchBarFocused: false,
            searchBarHovered: false
        }
    },
    mounted() {
        document.addEventListener('scroll', (e) => {
            this.scrolled = window.scrollY > 0
        })
    }
}
</script>

<style lang="stylus" scoped>
.topbar
    position fixed
    top: 0
    left: 0
    right: 0
    padding .5em 2em
    z-index: 900
    background var(--white)
    display flex
    // justify-content center
    align-items center
    &.scrolled
        box-shadow 0 5px 30px 10px rgba(0,0,0,0.0325)
    transition box-shadow 0.5s ease

.centered
    display flex
    width 100%
    justify-content center

.open-drawer i
    font-size 2em
.search
    margin-left 2em
    width 50vw
    &::-moz-placeholder
    &::-webkit-input-placeholder
    &::-ms-input-placeholder
        text-align: center

.logo
    z-index: 910
    pointer-events none
    display flex
    align-items center
    justify-content center
    position absolute
    width 100%
    height 100%
    top: 0
    transition opacity 0.25s ease
    img
        height: 2.125em

</style>
