<template lang="pug">
ul.ArrayButton(:class="{oneline}")
	slot
</template>

<script>
export default {
  name: "ArrayButton",
  
  props: {
    oneline: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="stylus" scoped>
.ArrayButton
	display flex
  &:not(.oneline)
    flex-wrap wrap
	& > li
		margin-right 2.5rem
</style>
