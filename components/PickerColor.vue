<template lang="pug">
.PickerColor
    BaseModal.picker(:name="`color-picker-${modalId}`")
        ul.swatches
            li.swatch(
                v-for="preset in presets" :key="preset.hex"
                :style="{backgroundColor: preset.hex}"
                v-tooltip="preset.name"
                @click="$emit('input', preset.hex)"
            )
        //- hr.sep
        .hex-input
            span.octothorpe #
            input.hex(type="text" maxlength="6" :value="value.substring(1)" @input="emitInputEvent($event)")
    .color-picker(:open-modal="`color-picker-${modalId}`" open-at="self.rightof" :class="color")
</template>

<script>
import tinycolor from "tinycolor2"
import BaseModal from "~/components/BaseModal.vue"
import TextBlockInput from "~/components/TextBlockInput.vue"
export default {
  name: "PickerColor",

  components: {
    BaseModal,
    TextBlockInput,
  },

  props: {
    value: String,
    modalId: String,
    color: {
      type: String,
      default: "black",
    },
  },

  data() {
    return {
      presets: [
        //From: https://material.io/resources/color/
        { hex: "#c62828", name: "Rouge" },
        { hex: "#ff5722", name: "Orange profond" },
        { hex: "#ef6c00", name: "Orange" },
        { hex: "#fdd835", name: "Jaune" },
        { hex: "#8bc34a", name: "Vert clair" },
        { hex: "#2e7d32", name: "Vert" },
        { hex: "#26a69a", name: "Turquoise" },
        { hex: "#00e5ff", name: "Cyan" },
        { hex: "#29b6f6", name: "Bleu clair" },
        { hex: "#1565c0", name: "Bleu" },
        { hex: "#003c8f", name: "Bleu foncé" },
        { hex: "#3f51b5", name: "Indigo" },
        { hex: "#5e35b1", name: "Violet profond" },
        { hex: "#9c27b0", name: "Violet" },
        { hex: "#e91e63", name: "Rose profond" },
        { hex: "#f06292", name: "Rose" },
        { hex: "#ffc1e3", name: "Rose clair" },
        { hex: "#a7c0cd", name: "Bleu-gris" },
        { hex: "#bdbdbd", name: "Gris" },
        { hex: "#6d4c41", name: "Marron" },
      ],
    }
  },

  methods: {
    emitInputEvent($event) {
      let val = $event.target.value
      if ([3, 6].includes(val.length)) {
        this.$emit("input", "#" + val)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.color-picker {
  height: 48px;
  width: 48px;

  &.black {
    border: 3px solid rgba(0, 0, 0, 0.75);
  }

  &.white {
    border: 3px solid rgba(255, 255, 255, 0.75);
  }

  cursor: pointer;
}

.picker /deep/ .modal-wrapper {
  padding: 0;
  overflow: hidden; // Fix weird scrollbar
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.swatches {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.swatch {
  height: 36px;
  width: 36px;

  @media (max-width: 888px) {
    height: 52px;
    width: 52px;
  }

  cursor: pointer;
}

.sep {
  width: 50px;
  color: black;
  margin: 10px 0;
}

.hex {
  width: 70px;

  @media (max-width: 888px) {
    width: 100px;
  }

  text-transform: uppercase;
}

.octothorpe {
  opacity: 0.5;
  margin: 0 5px;

  @media (max-width: 888px) {
    margin-left: 15px;
  }

  color: black;
}

.hex-input {
  font-family: 'Roboto Mono', monospace;
  display: flex;
  align-items: center;
  padding: 10px 0; // padding-bottom on modal-wrapper doesn't work

  @media (max-width: 888px) {
    font-size: 24px;
    padding: 20px 0;
  }
}
</style>
