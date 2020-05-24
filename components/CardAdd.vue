<template>
  <base-card :class="['--card-add', object]" @click="$emit('click')">
    <button-icon class="icon" filled>add</button-icon>
  </base-card>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
import BaseCard from '~/components/BaseCard.vue'
import ButtonIcon from '~/components/ButtonIcon.vue'

type ObjectNames = 'homework' | 'grade' | 'note' | 'subject'

export default Vue.extend({
  components: { BaseCard, ButtonIcon },
  props: {
    object: {
      type: String,
      required: true,
    } as PropOptions<ObjectNames>,
  },
})
</script>

<style lang="stylus">
// Can't override <base-card>'s styles without scoping out to increase the specifity
#page .--card-add
  border-color transparent
  background var(--blue-offset)

// Reactions
#page .--card-add:hover
#page .--card-add:focus
  border-color var(--blue)

#page .--card-add:active
  border-color transparent
  background var(--blue-offset-dark)
</style>

<style lang="stylus" scoped>
//
// Definitions
//



//
// Positioning
//

.--card-add
  display flex
  justify-content center
  align-items center

//
// Sizing
//

.icon
  font-size: 1.5em

//
// Spacing
//



//
// Decoration
//



//
// Colors
//

.icon
  color var(--blue)

//
// Typography
//



//
// Reactions
//

.--card-add
  cursor pointer

.--card-add:active .icon
  color var(--blue-dark)
</style>
