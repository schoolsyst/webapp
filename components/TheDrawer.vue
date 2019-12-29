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
                    LogoCompound
                li.user
                    button.logout(@click="$modal.show('confirm-logout')"): Icon power_settings_new
                    span.email {{ $auth.user.email || $auth.user.username }}
                li(
                    v-for="link in links"
                    :class="{current: isCurrent(link)}"
                    @click="$emit('close')"
                )
                    hr(v-if="link === 'separator'")
                    nuxt-link.link(v-else :to="link.href")
                        Icon(:filled="isCurrent(link)").icon {{link.icon}}
                        span.name {{link.name}}
                        span.notifications-badge(v-if="hasNotifications(link)") {{link.notifications}}
        .overlay(@click="$emit('close')", :style="{opacity: opened ? 1 : 0}")

</template>

<script>
import Icon from '~/components/Icon.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import ModalDialogConfirm from '~/components/ModalDialogConfirm.vue'
import LogoCompound from '~/components/LogoCompound.vue'
import { mapState, mapGetters } from 'vuex'

export default {
    components: { Icon, ButtonNormal, ModalDialogConfirm, LogoCompound },
    props: {
        opened: {
            type: Boolean,
            default: false
        }
    },
    computed: mapGetters({links: 'drawerLinks'}),
    methods: {
        isCurrent(link) {
            if (link === 'separator') return false
            const topPathFragment = this.$route.path.split('/')[1]
            return '/' + topPathFragment === link.href
        },
        hasNotifications(link) {
            if (link.hasOwnProperty('notifications')) {
                return link.notifications >= 1 || link.notifications === '99+'
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
nav
    position fixed
    left 0
    bottom 0
    top 0
    padding-top: 1.25em
    display flex
    background var(--white)
    z-index: 1000
    width: 20em
    overflow-y auto
    transition left .375s ease
    box-shadow 0 8px 10px -5px rgba(0,0,0,0.2),0 16px 24px 2px rgba(0,0,0,0.14),0 6px 30px 5px rgba(0,0,0,0.12)
.image
    padding-bottom: 0
    svg
        width: 15em
        height 3em
.user
    padding-top: 0
    margin-bottom: .5em
    display flex
    align-items center
    .email
        font-size: 0.85em
    .logout
        font-size 1.5em
        margin-right: 0.5em
        color var(--red)
        &:hover
            color var(--red-dark)

.link
    display flex
    align-items center
    .icon
        font-size: 1.4em
    .name
        margin-left: 1em
        font-size: 1.2em
        white-space nowrap
    &:hover, &:focus
        .icon
        .name
            color var(--blue-dark)
    &::-moz-focus-inner
        border-style none
    .notifications-badge
        margin-left auto
        background var(--red)
        color var(--white)
        padding .2em .5em
        border-radius calc(var(--border-radius) * (1/2))
        display flex
        font-family var(--fonts-monospace)


li
    padding .85em 1.5em
    margin .25em 0
    &.current
        color var(--blue)
        background var(--blue-offset)
        border-top-right-radius 3em
        border-bottom-right-radius 3em
hr
    margin .5em 0
    opacity: 0.25
ul
    z-index: 1000
.overlay
    position fixed
    top: 0
    right: 0
    bottom: 0
    top: 0
    width 100vw
    // background rgba(0,0,0,0.125)
    background transparent
    z-index: 900
.nav-wrapper:not(.opened) .overlay
    opacity: 0
    transition opacity 0.5s ease
    pointer-events none
</style>
