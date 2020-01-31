<template lang="pug">
  nav#side-rail
    ul
      li.item(
        v-for="(link, i) in sideRailLinks" :key="link.href"
        v-tooltip.left="link.name"
      )
        nuxt-link.link(
          :to="link.href"
          :class="{current: isCurrent(link), notifications: hasNotifications(link)}"
        )
          Icon.icon(:filled="isCurrent(link)") {{link.icon}}
          span.notifications-badge(v-if="hasNotifications(link)")
</template>

<script>
import { mapGetters } from 'vuex'
import Icon from '~/components/Icon.vue'

export default {
  components: { Icon },
  computed: mapGetters(['sideRailLinks']),
  methods: {
    isCurrent(link) {
      if (link.href === '/coming-soon') return false
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
  position: fixed

.item
  display: flex
  flex-direction: column
  justify-content: center
  width: 4em
  overflow: hidden
  margin-bottom: 2.5em
  padding: 0.25em 0

.link
  text-align: center
  color: var(--black)

  &:hover, &.current
    color: var(--blue)

  &:hover .name
    opacity: 1

  position: relative

.link .notifications-badge
  position: absolute
  display: block
  background: var(--red)
  height: 0.8em
  width: 0.8em
  border-radius: 50%
  top: 0
  right: 25%

.icon
  font-size: 1.85em
  display: block
</style>
