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
/* DESKTOP */
@media (min-width: 1000px) 
  .container 
    margin: 30px 0 0 30px

/* MOBILE */
@media (max-width: 999px) 
  .container 
    margin: 10px
</style>
