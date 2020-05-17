<template lang="pug">
  //TODO: Label
  //TODO: inherit from BaseInput
  .color-picker
    .swatch.opener(
      :style="{backgroundColor: value}"
      @click="$modal.open(modalName)"
      :title="colorName"
      v-tooltip="tooltip"
    )
    BaseModal(:name="modalName" title="Choisir une couleur...")
      form
        .swatches(name="swatches")
          .swatch(
            v-for="preset in sortedPresets" :key="preset.hex"
            :style="{backgroundColor: '#' + preset.hex}"
            @click="$emit('input', '#' + preset.hex); $modal.close(modalName)"
            :title="preset.name"
          )
        .custom-color
          .swatch(
            :style="{backgroundColor: value}"
            :title="colorName"
          )
          label
            Icon.native-picker-opener(
              v-tooltip="'Couleur personnalisée'"
            ) colorize
            input(
              type="color"
              :value="value.toUpperCase()" 
              @input="$emit('input', $event.target.value)"
              :name="`${modalName}--custom`"
            )
          .octothorpe #
          InputField.hex-input(
            :value="value.toUpperCase().replace('#', '')"
            @input="$emit('input', '#' + $event)"
            no-error-messages no-label no-action-button
            :name="`${modalName}--hex-input`"
          )
</template>

<script>
import tinycolor from 'tinycolor2'
import { firstBy } from 'thenby'
import BaseModal from '~/components/legacy/BaseModal.vue'
import Icon from '~/components/legacy/Icon.vue'
import InputField from '~/components/legacy/InputField.vue'

export default {
  components: {
    BaseModal,
    InputField,
    Icon,
  },
  props: {
    value: {
      type: String,
      default: '#000000',
    },
    namespace: String,
    tooltip: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      presets: [
        // From: https://material.io/resources/color/
        { hex: 'c62828', name: 'Rouge' },
        { hex: 'ff5722', name: 'Orange profond' },
        { hex: 'ef6c00', name: 'Orange' },
        { hex: 'fdd835', name: 'Jaune' },
        { hex: '8bc34a', name: 'Vert clair' },
        { hex: '2e7d32', name: 'Vert' },
        { hex: '26a69a', name: 'Turquoise' },
        { hex: '00e5ff', name: 'Cyan' },
        { hex: '29b6f6', name: 'Bleu clair' },
        { hex: '1565c0', name: 'Bleu' },
        { hex: '003c8f', name: 'Bleu foncé' },
        { hex: '3f51b5', name: 'Indigo' },
        { hex: '5e35b1', name: 'Violet profond' },
        { hex: '9c27b0', name: 'Violet' },
        { hex: 'e91e63', name: 'Rose profond' },
        { hex: 'f06292', name: 'Rose' },
        { hex: 'ffc1e3', name: 'Rose clair' },
        { hex: 'a7c0cd', name: 'Bleu-gris' },
        { hex: 'bdbdbd', name: 'Gris' },
        { hex: '6d4c41', name: 'Marron' },
        { hex: 'B38C80', name: 'Marron clair' },
      ],
    }
  },
  computed: {
    modalName() {
      if (!this.namespace) return 'color-picker'
      return `${this.namespace}-color-picker`
    },
    colorName() {
      if (!this.value || typeof this.value !== 'string') return false
      const value = this.value.toUpperCase()
      const preset = this.presets.find(p => '#' + p.hex.toUpperCase() === value)
      return preset ? `${preset.name} (${value})` : value
    },
    sortedPresets() {
      return [...this.presets].sort(firstBy(col => tinycolor(col).toHsl().h))
    },
  },
}
</script>

<style lang="stylus" scoped>
//FIXME: Bad, copy-pasted from <RadioButtons>
.BaseModal /deep/
  .content
    display flex
    justify-content center

legend
  display block
  margin-bottom 5px
  padding 0 10px
  text-transform uppercase
  letter-spacing 1px
  font-weight 500
  font-size 0.75em

.opener
  border-radius var(--border-radius)
  cursor pointer

swatch-width = 2.5em

.swatch
  display block
  width swatch-width
  height swatch-width

.swatches
  display flex
  flex-wrap wrap
  //justify-content center
  margin-bottom 1em
  width swatch-width * 7

  @media (max-width: 375px)
    width swatch-width * 6

  input
    display none

  .swatch
    width swatch-width
    height swatch-width
    border-radius 0
    cursor pointer

.custom-color
  hex-input-padding = 0.5em

  display flex
  align-items center
  //justify-content center
  width 100%
  height swatch-width
  font-family var(--fonts-monospace-light)

  .swatch
    margin-right 0.25em
    width 'calc(%s / 2)' % swatch-width

  label
    display flex
    align-items center

  .native-picker-opener
    font-size 1.5em
    cursor pointer

  input
    display none

  .octothorpe
    margin-right 0.5em
    margin-left auto
    color var(--grey-dark)
    font-size 1.2em

  .hex-input
    height swatch-width

  .hex-input, .hex-input /deep/ input
    width 'calc(6ch + %s * 2 + 5px)' % hex-input-padding
    font-family var(--fonts-monospace-light) !important //FIXME: make a 'font-family' opt on <InputField>

  .hex-input /deep/ input
    padding hex-input-padding
    min-width 'calc(6ch + %s * 2 + 5px)' % hex-input-padding
</style>
