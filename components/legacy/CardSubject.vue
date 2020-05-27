<template lang="pug">
  .card-wrapper(
      :style="{backgroundColor, borderColor}"
      @click="$emit('click')"
    )
    BadgeSubject.color-dot(
      v-if="!fullColor"
      no-tooltip variant="dot"
      v-bind="{color, name}"
    )
    span.name(:style="{color: textColor}") {{ name }}
    //- button.action(:style="{color: textColor}")
    //-   Icon: slot(name="action-icon") edit
</template>

<script>
import { mapGetters } from 'vuex'
import Icon from '~/components/legacy/Icon.vue'
import BadgeSubject from '~/components/legacy/BadgeSubject.vue'

export default {
  components: { Icon, BadgeSubject },
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      default: 1,
      validate: val => val >= 0,
    },
    goal: {
      type: Number,
      default: null,
      validate: val => val === null || (val >= 0 && val <= 1),
    },
    // Options
    fullColor: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    backgroundColor() {
      return this.fullColor ? this.color : null
    },
    borderColor() {
      if (this.fullColor) return this.color
      return false
    },
    textColor() {
      if (this.fullColor) return this._textColor()(this.color)
      return false
    },
  },
  methods: {
    ...mapGetters({ _textColor: 'textColor' }),
  },
}
</script>

<style lang="stylus" scoped>
.card-wrapper
  display flex
  align-items center
  padding 1em 1.2em
  max-width 450px
  border solid 2px var(--grey-light)
  border-radius var(--border-radius)
  cursor pointer

  .color-dot
    margin-right 0.5em
    font-size 1.3em

  .action
    margin-left auto

  .action /deep/ i
    color inherit
    font-size 1.5em

  .name
    font-size 1.1em
</style>
