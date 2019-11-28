<template lang="pug">
    .nav-wrapper(:class="{opened}")
        nav#drawer(:style="{left: !opened ? '-500px' : '0px'}")
            ul
                li.image 
                    img(src="/logos/compound.svg")
                li.user
                    nuxt-link.logout(to="/logout" title="Déconnexion"): Icon power_settings_new
                    span.email {{ $auth.user.email }}
                li(
                    v-for="link in links"
                    :class="{current: isCurrent(link)}"
                )
                    hr(v-if="link === 'separator'")
                    nuxt-link.link(v-else :to="link.href")
                        Icon(:filled="isCurrent(link)").icon {{link.icon}}
                        span.name {{link.name}}
        .overlay(@click="$emit('close')", :style="{opacity: opened ? 1 : 0}")

</template>

<script>
import Icon from '~/components/Icon.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'

export default {
    components: { Icon, ButtonNormal },
    props: {
        opened: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            links: [
                { 
                    name: 'Timeline',
                    href: '/', 
                    icon: 'timeline' 
                },
                { 
                    name: 'Cours',
                    href: '/notes', 
                    icon: 'insert_drive_file' 
                },
                { 
                    name: 'Devoirs',
                    href: '/homework', 
                    icon: 'book' 
                },
                { 
                    name: 'Emploi du temps',
                    href: '/schedule', 
                    icon: 'today' 
                },
                { 
                    name: 'Notes',
                    href: '/grades', 
                    icon: 'school' 
                },
                { 
                    name: 'Sac',
                    href: '/bag', 
                    icon: 'work_outline'
                },
                'separator',
                {
                    name: 'Réglages',
                    href: '/settings',
                    icon: 'settings'
                },
                {
                    name: 'Signaler un bug',
                    href: '/bug-report',
                    icon: 'bug_report'
                }
            ],
        }
    },
    methods: {
        isCurrent(link) {
            if (link === 'separator') return false
            const href = link.href
            const topPathFragment = this.$route.path.split('/')[1]
            return '/' + topPathFragment === href
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
    overflow hidden
    transition left .25s ease
    box-shadow 0 8px 10px -5px rgba(0,0,0,0.2),0 16px 24px 2px rgba(0,0,0,0.14),0 6px 30px 5px rgba(0,0,0,0.12)
.image
    padding-bottom: 0
    img
        width: 15em
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


li
    padding .85em 1.5em
    margin .25em 0
    &.current
        color var(--blue)
        background var(--offset-blue)
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
    background rgba(0,0,0,0.25)
    z-index: 900
.nav-wrapper:not(.opened) .overlay
    opacity: 0
    transition opacity 0.5s ease
    pointer-events none
</style>
