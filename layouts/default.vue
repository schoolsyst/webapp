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
import moment from 'moment';

export default {
  components: {
    TheNavbar,
    TheFooter
  },
  mounted() {
    // fix weird nuxt bug where the exercises+test arrays are duped outside of the #__nuxt container
    document.querySelectorAll('body > *:not(#__nuxt)').forEach(e => e.remove())
    setInterval(() => {
      this.$store.commit("UPDATE_TIME", moment())
    }, 1000);
  },
};
</script>

<style scoped lang="sass">
@import '~/assets/defaults'

// Keep footer outta the first page
.TheNavbar + div
  min-height: 100vh

/* DESKTOP */
+desktop 
  .container 
    margin: 50px 0 0 calc(50px + 60px)


/* MOBILE */
+mobile 
  .container 
    margin: 20px
    padding-bottom: calc((100vw - 30px) / 6)
    
@media (min-width: $bk-sidebar)
  .container
    margin-left: 110px

@media (max-width: $bk-sidebar - 1px)
  .container
    padding-bottom: 100px
</style>
