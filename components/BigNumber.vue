<template lang="pug">
    //FIXME: does not update valueDisp when it has been modified by hand
    span.BigNumber
        span.sign(
            v-if="showSign"  
            :contenteditable="writables.includes('sign' )"
            @input="onInput($event)"
            @blur="onBlur()"
            :style="{color: signColor}"
        )
            i.material-icons(v-if="value > 0") trending_up
            i.material-icons(v-else-if="value < 0") trending_down
            i.material-icons(v-else-if="value === 0") trending_flat
            span(v-else) {{sign}}
        span.value(
            :contenteditable="writables.includes('value')"
            @input="onInput($event)"
            @blur="onBlur()"
        ) {{display()(value, 1, 2, !showSign)}}
        //- dunno why I need `funcName()(args...)` but hey if I call 
                                      ^^
            it normally it spits out the function's source code 
            as a string (crazy right? I love JS.)
        span.unit(
            v-if="unit.trim()"  
            :contenteditable="writables.includes('unit' )"
            @input="onInput($event)"
            @blur="onBlur()"
        ) {{unit}}
    </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "BigNumber",

  props: {
    value: {
      default: "—"
    },
    showSign: {
      type: Boolean,
      default: false
    },
    unit: {
      type: String,
      default: "",
    },
    writables: {
      type: Array,
      default: () => [],
    },
    fixed: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {}
  },

  computed: {
    sign() {
      if (this.value > 0) return '+'
      if (this.value < 0) return '-'
      else                return '±'
    },
    signColor() {
      switch (this.sign) {
        case "+":
          return "var(--blue)"
          break

        case "-":
          return "var(--red)"
          break

        default:
          return ""
          break
      }
    },
  },

  methods: {
    ...mapGetters('grades', ['display']),
    onInput($event) {
      $event.target.innerText = $event.target.innerText.replace(/—/, () => "")
      if (!$event.target.innerText.length || isNaN($event.target.innerText)) {
        $event.target.innerText = "—"
      }

      let range = document.createRange() //Create a range (a range is a like the selection but invisible)
      range.selectNodeContents($event.target) //Select the entire contents of the element with the range
      range.collapse(false) //collapse the range to the end point. false means collapse to end rather than the start
      let selection = window.getSelection() //get the selection object (allows you to change selection)
      selection.removeAllRanges() //remove any selections already made
      selection.addRange(range) //make the range you have just created the visible selectio

      this.$emit("input", $event.target.innerText)
    },
    onBlur() {
      document.getSelection().removeAllRanges()
    },
  },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.BigNumber 
    height: 96px
    line-height: 96px
    font-weight: 500

input.value
    max-width: 150px

.value, .sign
    font-size: 96px

.sign .material-icons
    font-size: 72px

.sign
    margin-right: 10px

.unit 
    font-weight: 500
    font-size: 56px
    opacity: 0.25

+mobile
    .value, .sign 
        font-size: 96px
    
    .BigNumber 
        line-height: 96px
        height: 96px
    
    .unit 
        font-size: 64px
    

</style>
