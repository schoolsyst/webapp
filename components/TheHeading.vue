<template>
  <h1 class="TheHeading">
    <slot></slot>
  </h1>
</template>

<script>
export default {
  name: 'TheHeading'
}
</script>

<style lang="stylus" scoped>
.TheHeading
  font-weight: 100

  @media (max-width 650px)
    font-size: 48px
    margin-bottom: 5px

  @media (min-width 650px)
    font-size: 3rem
    line-height: 3rem
</style>
