<template lang="pug">
    .nav-wrapper(:class="{opened}")
        ModalDialogConfirm(
            heading=""
            confirm-text="Déconnexion"
            @confirm="$router.push('/logout')"
            name="logout"
        )
            p Êtes-vous sûr(e) de vouloir vous déconnecter ?
        nav#drawer(:style="{left: !opened ? '-500px' : '0px'}")
            ul
                li.image 
                    nuxt-link(to="/"): LogoCompound
                li.user
                    button.logout(@click="$modal.show('confirm-logout')"): Icon power_settings_new
                    span.email {{ $auth.user.email || $auth.user.username }}
                li(
                    v-for="link in links"
                    :class="{current: isCurrent(link)}"
                    @click="$emit('close')"
                )
                    hr(v-if="link === 'separator'")
                    component.link(
                      v-else-if="link.href"
                      :to="link.href || false"
                      :is="link.href ? 'nuxt-link' : 'button'"
                      @click="link.modal ? $modal.open(link.modal) : false"
                    )
                        Icon(:filled="isCurrent(link)").icon {{link.icon}}
                        span.name {{link.name}}
                        span.notifications-badge(v-if="hasNotifications(link)") {{link.notifications}}
        .overlay(@click="$emit('close')", :style="{opacity: opened ? 1 : 0}")

</template>

<script>
import { mapGetters } from 'vuex'
import Icon from '~/components/legacy/Icon.vue'
import ButtonNormal from '~/components/legacy/ButtonNormal.vue'
import ModalDialogConfirm from '~/components/legacy/ModalDialogConfirm.vue'
import LogoCompound from '~/components/legacy/LogoCompound.vue'

export default {
  components: { Icon, ButtonNormal, ModalDialogConfirm, LogoCompound },
  props: {
    opened: {
      type: Boolean,
      default: false,
    },
  },
  computed: mapGetters({ links: 'drawerLinks' }),
  methods: {
    isCurrent(link) {
      if (!link.href) return false
      if (link === 'separator') return false
      if (link.href === '/coming-soon') return false
      const topPathFragment = this.$route.path.split('/')[1]
      return '/' + topPathFragment === link.href
    },
    hasNotifications(link) {
      if (Object.prototype.hasOwnProperty.call(link, 'notifications')) {
        return link.notifications >= 1 || link.notifications === '99+'
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
nav
  position fixed
  top 0
  bottom 0
  left 0
  z-index 1000
  display flex
  overflow-y auto
  padding-top 1.25em
  width 20em
  background var(--white)
  box-shadow 0 8px 10px -5px rgba(0, 0, 0, 0.2), 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12)
  transition left 0.375s ease

.image
  padding-bottom 0

  svg
    width 15em
    height 3em

.user
  display flex
  align-items center
  margin-bottom 0.5em
  padding-top 0

  .email
    font-size 0.85em

  .logout
    margin-right 0.5em
    color var(--red)
    font-size 1.5em

    &:hover
      color var(--red-dark)

.link
  display flex
  align-items center

  .icon
    font-size 1.4em

  .name
    margin-left 1em
    white-space nowrap
    font-size 1.2em

  &:hover, &:focus
    .icon, .name
      color var(--blue-dark)

  &::-moz-focus-inner
    border-style none

  .notifications-badge
    display flex
    margin-left auto
    padding 0.2em 0.5em
    border-radius calc(var(--border-radius) * (1 / 2))
    background var(--red)
    color var(--white)
    font-family var(--fonts-monospace)

li
  margin 0.25em 0
  padding 0.85em 1.5em

  &.current
    border-top-right-radius 3em
    border-bottom-right-radius 3em
    background var(--blue-offset)
    color var(--blue)

hr
  margin 0.5em 0
  opacity 0.25

ul
  z-index 1000

.overlay
  position fixed
  top 0
  top 0
  right 0
  bottom 0
  z-index 900
  width 100vw
  //background rgba(0,0,0,0.125)
  background transparent

.nav-wrapper:not(.opened) .overlay
  opacity 0
  transition opacity 0.5s ease
  pointer-events none
</style>
