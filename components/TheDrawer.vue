<template lang="pug">
    nav#drawer(:expanded="expanded")
        ul
            li(v-for="link in links" :key="href")
                nuxt-link(:to="link.href" :class="{current: isCurrent(link.href)}").link
                    Icon.icon {{link.icon}}
                    span.name {{link.name}}

</template>

<script>
import Icon from '~/components/Icon.vue'

export default {
    components: { Icon },
    props: {
        expanded: {
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
                }

            ]
        }
    },
    methods: {
        isCurrent(href) {
            const topPathFragment = this.$route.path.split('/')[0]
            return '/' + topPathFragment === href
        }
    }
}
</script>

<style lang="stylus" scoped>
.link
    display flex
    align-items center
</style>
