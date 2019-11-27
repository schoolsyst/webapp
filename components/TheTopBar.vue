<template lang="pug">
    #topbar.topbar
        button.open-drawer(@click="$emit('menu-click')"): Icon menu
        .centered
            InputField.search(
                variant="filled"
                placeholder="Aller quelque part…" 
                no-error-messages 
                no-label
                v-model="searchText"
            )
</template>

<script>
import Icon from '~/components/Icon.vue'
import InputField from '~/components/InputField.vue'

export default {
    components: { Icon, InputField },
    data() {
        return {
            searchText: "",
            active: false
        }
    },
    mounted() {
        console.log(window)
        document.addEventListener('scroll', (e) => {
            this.active = window.scrollY > 0
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
    &.active
        box-shadow 0 10px 30px 10px rgba(0,0,0,0.0625)

.centered
    display flex
    width 100%
    justify-content center

.open-drawer i
    font-size 2em
.search
    margin-left 2em
    width 50vw

</style>
