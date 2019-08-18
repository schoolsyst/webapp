<template>
  <div class="app">
    <TheNavbar />
    <nuxt />
    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from "~/components/TheNavbar.vue";
import TheFooter from "~/components/TheFooter.vue";

export default {
  components: {
    TheNavbar,
    TheFooter
  }
};
</script>

<style scoped lang="sass">
@import '~/assets/defaults'

/* DESKTOP */
+desktop 
  .container 
    margin: 50px 0 0 calc(50px + 60px)


/* MOBILE */
+mobile 
  .container 
    margin: 20px
    padding-bottom: calc((100vw - 30px) / 6)
    
+desktop
  .container
    margin-left: 110px

@media (max-width: $bk-sidebar - 1px)
  .container
    padding-bottom: 100px
</style>
