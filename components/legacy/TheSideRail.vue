<template lang="pug">
  nav#side-rail
    ul
      li.item(
        v-for="(link, i) in sideRailLinks" :key="link.href"
        v-tooltip.left="link.name"
      )
        component.link(
          :is="link.href ? 'nuxt-link' : 'button'"
          :to="link.href || false"
          :class="{current: isCurrent(link), notifications: hasNotifications(link)}"
          @click="link.modal ? $modal.open(link.modal) : false"
        )
          Icon.icon(:filled="isCurrent(link)") {{link.icon}}
          span.notifications-badge(v-if="hasNotifications(link)")
</template>

<script>
import { mapGetters } from 'vuex'
import Icon from '~/components/legacy/Icon.vue'

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
    },
  },
}
</script>

<style lang="stylus" scoped>
nav
  position fixed

.item
  display flex
  flex-direction column
  justify-content center
  overflow hidden
  margin-bottom 2.5em
  padding 0.25em 0
  width 4em

.link
  color var(--black)
  text-align center

  &:hover, &.current
    color var(--blue)

  &:hover .name
    opacity 1

  position relative

.link .notifications-badge
  position absolute
  top 0
  right 25%
  display block
  width 0.8em
  height 0.8em
  border-radius 50%
  background var(--red)

.icon
  display block
  font-size 1.85em
</style>
