<template lang="pug">
    nav#drawer
        ul
            li.user 
                span.username {{ $auth.user.username }}
                br
                span.email {{ $auth.user.email }}
            li(
                v-for="link in links"
                :key="href"
                :class="{current: isCurrent(link.href)}"
            )
                hr(v-if="link === 'separator'")
                nuxt-link.link(v-else :to="link.href")
                    Icon.icon {{link.icon}}
                    span.name {{link.name}}

</template>

<script>
import Icon from '~/components/Icon.vue'

export default {
    components: { Icon },
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
            ]
        }
    },
    methods: {
        isCurrent(href) {
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
    padding-top: 30px
    display flex
    background var(--white)
    z-index: 1000
    width: 300px
    overflow hidden
    transition width .25s ease
    box-shadow 0 8px 10px -5px rgba(0,0,0,0.2),0 16px 24px 2px rgba(0,0,0,0.14),0 6px 30px 5px rgba(0,0,0,0.12)
.username
    font-size: 24px
.email
    font-size: 14px
.link
    display flex
    align-items center
    .icon
        font-size: 32px
    .name
        margin-left: 20px
        font-size: 18px
        white-space nowrap

li
    padding 18px 24px
    &.current
        color var(--blue)
        background var(--offset-blue)
        border-top-right-radius 60px
        border-bottom-right-radius 60px
hr
    margin 5px 0
    opacity: 0.25
</style>
