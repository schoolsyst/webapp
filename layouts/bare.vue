<template>
  <div class="app">
    <nuxt />
  </div>
</template>

<script>
export default {
  components: {
  }
};
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
