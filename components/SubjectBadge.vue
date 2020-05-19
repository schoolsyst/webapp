<template>
  <div
    :class="{
      '--subject-badge': true,
      expandable,
      expanded,
      editable,
    }"
    :style="{ backgroundColor: bgColor, color: fgColor }"
    :title="badgeTitle"
    @mouseenter="expanded = alwaysExpanded || expandable"
    @mouseleave="expanded = alwaysExpanded"
  >
    <button-icon small class="button-edit" @click="$emit('edit')"
      >edit</button-icon
    >
    <div class="name">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
import { isHexColor } from '~/utils/validators'
import { lightColor, darkColor } from '~/utils/colors'
import ButtonIcon from '~/components/ButtonIcon.vue'

export default Vue.extend({
  components: { ButtonIcon },
  props: {
    expandable: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    alwaysExpanded: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    color: {
      type: String,
      required: true,
      validator: isHexColor,
    } as PropOptions<string>,
    editable: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
  },
  data() {
    return { expanded: this.alwaysExpanded }
  },
  computed: {
    bgColor(): string {
      return this.expanded ? lightColor(this.color) : this.color
    },
    fgColor(): string {
      return darkColor(this.color)
    },
    badgeTitle(): string | null {
      const slotText = this.$slots.default?.[0]?.text
      if (slotText && !this.expanded) {
        return slotText
      }
      return null
    },
  },
})
</script>

<style lang="stylus" scoped>
//
//Definitions
//
dot-size = 1.8em

//
//Positioning
//
.--subject-badge
  display inline-flex
  align-items center

.--subject-badge.editable .name
  margin-left 0.5em

.name
  white-space nowrap

.--subject-badge:not(.editable) .button-edit
  width 0

//
//Sizing
//
.--subject-badge:not(.expanded)
  max-width dot-size

//
//Spacing
//
.button-edit
  width dot-size
  font-size 0.85em

.--subject-badge
  padding 0 0.5em
  height dot-size

//
//Color
//

//
//Decoration
//
.--subject-badge
  border-radius 1000px

.--subject-badge:not(.editable) .button-edit
  cursor default

//
//Visibility
//
.name
  overflow hidden
  opacity 0

.button-edit
  opacity 0

//
//States
//

//When the element is not expanded and _can_ be expanded
.expandable
  transition 250ms ease all

.expanded.editable
  cursor pointer

  .button-edit
    opacity 1

.expanded
  max-width 25ch

  .name
    opacity 1
</style>
