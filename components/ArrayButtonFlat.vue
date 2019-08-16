<template lang="pug">
ul.ArrayButtonFlat(:class="{'inline': inline}")
    slot
</template>

<script>
export default {
  name: "ArrayButtonFlat",

  props: {
    inline: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  computed: {},

  created() {},

  methods: {}
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.ArrayButtonFlat
    margin-top: 10px

+desktop 
    .ArrayButtonFlat 
        width: 50%
    
    .ArrayButtonFlat.inline 
        display: inline
        margin-top: 0

    .HeadingSub, .ButtonFlat 
        display: inline

+desktop 
    .ArrayButtonFlat 
        display: grid
        grid-template-columns: repeat(2, max-content)
        grid-gap: 5px

    .ArrayButtonFlat.inline 
        display: inline-grid
        padding-left: 30px

+mobile
    .BaseFlatComponent
      margin-bottom: 5px

</style>