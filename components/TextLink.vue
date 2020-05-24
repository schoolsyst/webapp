<template>
  <component
    :is="element"
    v-bind="{ ...toOrHref, target, rel, title, ...$attrs }"
    :class="{ '--text-link': true, external: isExternal }"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  props: {
    to: {
      type: String,
      required: true,
    } as PropOptions<string>,
    newTab: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    title: {
      type: String,
      default: '',
    } as PropOptions<string>,
  },
  computed: {
    isExternal(): boolean {
      /* If the URL targeted starts with one of the three protocols http, https or ftp,
       * the link  is assumed to be external.
       */
      return /^(https?|ftp):\/\//.test(this.to)
    },
    element(): 'nuxt-link' | 'a' {
      /* External links need normal <a> while internal ones can be
       * optimized by <nuxt-link>.
       */
      return this.isExternal ? 'a' : 'nuxt-link'
    },
    toOrHref(): { href: string } | { to: string } {
      // External links use [href], while <nuxt-link> uses [to]
      if (this.isExternal) {
        return { href: this.to }
      }
      return { to: this.to }
    },
    target(): '_blank' | null {
      // Set target="_blank" to open in new tab
      return this.newTab ? '_blank' : null
    },
    rel(): string | null {
      let relArray: string[] = []
      // Prevent leaks via `Window.opener`
      if (this.isExternal)
        relArray = [...relArray, 'external', 'noopener', 'noreferrer']
      // rel list is space-separated
      const relString = relArray.join(' ')
      // Don't include the attribute if the list is empty
      if (!relString) return null
      return relString
    },
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
  position relative
  bottom -0.1em
  margin-left 0.1em
  content '\e89e'
  font-size 1.2em
  font-family 'Material Icons'

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
