<template lang="pug">
  nav
    ul
      li(v-for="(link, i) in sideRailLinks" :key="link.href")
        nuxt-link(:to="link.href")
          Icon {{link.icon}}
          span.name {{link.name}}
</template>

<script>
import Icon from '~/components/Icon.vue'
import { mapGetters } from 'vuex'

export default {
  components: { Icon },
  computed: mapGetters(['sideRailLinks'])
}
</script>
