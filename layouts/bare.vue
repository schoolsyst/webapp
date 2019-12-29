<template>
  <div class="app">
    <div id="loading-screen">
      <h1 class="title"></h1>
      <p class="subtitle"></p>
    </div>
    <nuxt id="page" />
  </div>
</template>

<script>
import { toDate } from "date-fns"

export default {
  head() {
    return {
      bodyAttrs: {
        class: "layoutBare",
      },
    }
  },
  async mounted() {
    await this.$store.dispatch('theme/set')
    // Refresh time every second
    setInterval(() => {
      this.$store.commit('UPDATE_TIME', toDate(Date.now()))
    }, 1 * 1000)
  },
}
</script>

<style scoped lang="sass">
@import '~/assets/defaults'

.container
  height: 100vh
  width: 100vw

+mobile
  .container
    padding: 10px
</style>

<style lang="sass">
//WARNING: _NOT_ SCOPED!
body.layoutBare
  overflow-x: hidden
</style>
