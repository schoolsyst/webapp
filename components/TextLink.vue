<template>
  <a :href="href" class="--text-link">
    <slot></slot>
  </a>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
import { isURL } from '~/utils/validators'
export default Vue.extend({
  props: {
    href: {
      type: String,
      required: true,
      validator: isURL,
    } as PropOptions<string>,
  },
})
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

//
//Decoration
//
.--text-link
  border-bottom 2px solid

.--text-link.external::after
  font-family: 'Material Icons'
  content: '\e89e'
  font-size: 1.2em
  margin-left: 0.1em
  position: relative
  bottom: -.1em

//
//Colors
//
.--text-link
  border-color var(--blue)
  color var(--blue)

//
//Typography
//

//
//States
//
.--text-link:hover, .--text-link:focus, .--text-link:active
  border-color var(--blue-dark)
  color var(--blue-dark)
</style>
