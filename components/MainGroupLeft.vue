<template lang="pug">
section.MainGroupLeft: slot
</template>

<script>
export default {
  name: "MainGroupLeft",
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.MainGroupLeft
    grid-column: 1

</style>