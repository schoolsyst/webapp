<template lang="pug">
label.LabelFlat
    slot
</template>

<script>
export default {
  name: "LabelFlat",
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.LabelFlat
    opacity: 0.5
    text-transform: uppercase
    letter-spacing: 1px
    font-size: 16px
    margin-bottom: 5px
    font-weight: bold
    display: block

</style>