<template>
  <div class="--base-card">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>

<style lang="stylus" scoped>
//
//Definitions
//

//
//Positioning
//

//
//Sizing
//

//
//Spacing
//
.--base-card
  padding 1rem

//
//Decoration
//
.--base-card
  border 1px solid
  border-radius var(--border-radius)

//
//Colors
//
.--base-card
  background var(--white)
  border-color var(--grey-offset-dark)
</style>
