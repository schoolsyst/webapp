<template>
  <h1 class="TheHeading">
    <slot></slot>
  </h1>
</template>

<script>
export default {
  name: "TheHeading",
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.TheHeading
    font-weight: 100
    +mobile
        font-size: 48px
        margin-bottom: 5px
    +desktop 
        font-size: 3rem
        line-height: 3rem

</style>
