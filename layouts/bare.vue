<template>
  <div class="app">
    <nuxt />
  </div>
</template>

<script>
import { toDate } from "date-fns";

export default {
  head() {
    return {
      bodyAttrs: {
        class: "layoutBare"
      }
    };
  },
  created() {
    setInterval(() => {
      this.$store.now = toDate(Date.now());
      console.log(`[updateTime] ${this.$store.now}`);
    }, 1000);
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

<style lang="sass">
//WARNING: _NOT_ SCOPED!
body.layoutBare
  overflow-x: hidden
</style>