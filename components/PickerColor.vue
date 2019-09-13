<template lang="pug">
.PickerColor
    BaseModal.picker(:name="`color-picker-${modalId}`")
        ul.swatches
            li.swatch(
                v-for="preset in presets" :key="preset.hex"
                :style="{backgroundColor: preset.hex}"
                :title="preset.name"
                @click="$emit('input', preset.hex)"
            )
        hr.sep
        input.hex(type="text" :value="value" @input="$emit('input', $event.target.value)")
    .color-picker(:open-modal="`color-picker-${modalId}`" open-at="self")
</template>

<script>
import tinycolor from 'tinycolor2'
import BaseModal from '~/components/BaseModal.vue'
import TextBlockInput from '~/components/TextBlockInput.vue'
export default {
    name: 'PickerColor',

    components: {
        BaseModal, TextBlockInput
    },

    props: {
        value: String,
        modalId: String,
        color: {
            type: String,
            default: 'black'
        }
    },

    data() {
        return {
            presets: [
                //From: https://material.io/resources/color/
                {hex: "#c62828", name: "Rouge"},
                {hex: "#ff5722", name: "Orange profond"},
                {hex: "#ef6c00", name: "Orange"},
                {hex: "#fdd835", name: "Jaune"},
                {hex: "#8bc34a", name: "Vert clair"},
                {hex: "#2e7d32", name: "Vert"},
                {hex: "#26a69a", name: "Vert-bleu"},
                {hex: "#00e5ff", name: "Cyan"},
                {hex: "#29b6f6", name: "Bleu clair"},
                {hex: "#1565c0", name: "Bleu"},
                {hex: "#003c8f", name: "Bleu foncé"},
                {hex: "#3f51b5", name: "Indigo"},
                {hex: "#5e35b1", name: "Violet profond"},
                {hex: "#9c27b0", name: "Violet"},
                {hex: "#e91e63", name: "Rose profond"},
                {hex: "#f06292", name: "Rose"},
                {hex: "#ffc1e3", name: "Rose clair"},
                {hex: "#a7c0cd", name: "Bleu-gris"},
                {hex: "#bdbdbd", name: "Gris"},
                {hex: "#6d4c41", name: "Marron"},

            ]
        }
    },
}
</script>

<style lang="stylus" scoped>
.color-picker
    height: 48px
    width: 48px
    border: 3px solid rgba(255,255,255,0.75)
    cursor pointer
.picker /deep/ .modal-wrapper
    padding-top 0
    padding-left 0
    padding-right 0
    display flex
    flex-direction column
    justify-content center
    align-items center
.swatches
    display grid
    grid-template-columns repeat(5, 1fr)
.swatch
    height: 36px
    width: 36px
.sep
    width: 50px
    color black
    margin 10px 0
.hex
    width 50px
</style>