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
            .logo(:style="{opacity: !searchBarHovered && !searchBarFocused ? '1' : '0'}")
                LogoCompound
</template>

<script>
import Icon from '~/components/Icon.vue'
import InputField from '~/components/InputField.vue'
import LogoCompound from '~/components/LogoCompound.vue'

export default {
  components: { Icon, InputField, LogoCompound },
  data() {
    return {
      searchText: '',
      scrolled: false,
      searchBarFocused: false,
      searchBarHovered: false,
    }
  },
  mounted() {
    document.addEventListener('scroll', e => {
      this.scrolled = window.scrollY > 0
    })
  },
}
</script>

<style lang="stylus" scoped>
.topbar
  position fixed
  top 0
  right 0
  left 0
  z-index 900
  display flex
  //justify-content center
  align-items center
  padding 0.5em 2em
  background var(--white)

  &.scrolled
    box-shadow 0 5px 30px 10px rgba(0, 0, 0, 0.0625)

  transition box-shadow 0.5s ease

.centered
  display flex
  justify-content center
  width 100%

.open-drawer i
  color var(--black)
  font-size 2em

.search
  margin-left 2em
  width 50vw

  &::-moz-placeholder, &::-webkit-input-placeholder, &::-ms-input-placeholder
    text-align center

.logo
  position absolute
  top 0
  z-index 910
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%
  transition opacity 0.25s ease
  pointer-events none

  svg
    height 2.25em
</style>
