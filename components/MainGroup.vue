<template>
  <main class="MainGroup" :class="{'full-size': fullSize}">
    <slot></slot>
  </main>
</template>

<script>
export default {
  name: "MainGroup",

  props: {
    fullSize: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  computed: {},

  created() {},

  methods: {}
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
//SHARED
.MainGroup:not(.full-size) 
    display: grid

//DESKTOP
+desktop 
    .MainGroup:not(.full-size) 
        grid-template-columns: repeat(2, 1fr)
        grid-gap: 20px
  

//MOBILE
+mobile 
    .MainGroup:not(.full-size) 
        grid-template-columns: 1fr
    [class^=MainGroup]
        max-width: 100vw
</style>