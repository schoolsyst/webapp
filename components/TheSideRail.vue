<template lang="pug">
  nav#side-rail
    ul
      li.item(v-for="(link, i) in sideRailLinks" :key="link.href")
        nuxt-link.link(
          :to="link.href"
          :class="{current: isCurrent(link), notifications: hasNotifications(link)}"
        )
          Icon.icon(:filled="isCurrent(link)") {{link.icon}}
          span.name {{link.name}}
          span.notifications-badge(v-if="hasNotifications(link)")
</template>

<script>
import Icon from '~/components/Icon.vue'
import { mapGetters } from 'vuex'

export default {
  components: { Icon },
  computed: mapGetters(['sideRailLinks']),
  methods: {
    isCurrent(link) {
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
.item
  display flex
  flex-direction column
  justify-content center
  width 4em
  overflow hidden
  margin-bottom: 1.5em
  padding .25em 0
.link
  text-align center
  color var(--black)
  &:hover, &.current
    color var(--blue)
  &:hover .name
      opacity: 1
  position relative
.link .notifications-badge
  position absolute
  display block
  background var(--red)
  height 0.80em
  width 0.80em
  border-radius 50%
  top: 0
  right: 25%
.icon
  font-size 1.85em
  display block
.name
  white-space nowrap
  text-overflow ellipsis
  font-size: 0.85em
  opacity: 0
</style>
