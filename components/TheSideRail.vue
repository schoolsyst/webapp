<template lang="pug">
  nav#side-rail
    ul
      li.item(v-for="(link, i) in sideRailLinks" :key="link.href" :class="{current: isCurrent(link)}")
        nuxt-link.link(:to="link.href")
          Icon.icon(:filled="isCurrent(link)") {{link.icon}}
          span.name {{link.name}}
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
  margin-bottom: 2em
  padding .25em 0
.link
  text-align center
  color var(--blue)
.icon
  font-size 1.75em
  display block
.name
  white-space nowrap
  text-overflow ellipsis
  font-size: 0.75em
</style>
