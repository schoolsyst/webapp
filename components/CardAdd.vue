<template>
  <button-icon class="--card-add" filled>add</button-icon>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
import ButtonIcon from '~/components/ButtonIcon.vue'

export default Vue.extend({
  components: { ButtonIcon },
})
</script>

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

.--card-add
  font-size: 1.5em

//
// Spacing
//



//
// Decoration
//

.--card-add
  border 1px solid
  border-radius var(--border-radius)

//
// Colors
//

.--card-add
  color var(--blue)
  border-color transparent
  background var(--blue-offset)

//
// Typography
//



//
// Reactions
//

.--card-add
  cursor pointer

.--card-add:hover
.--card-add:focus
  border-color var(--blue)

.--card-add:active
  color var(--blue-dark)
  border-color transparent
  background var(--blue-offset-dark)
</style>
