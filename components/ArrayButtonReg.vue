<template lang="pug">
ul.ArrayButtonReg
    slot
</template>

<script>
export default {
  name: "ArrayButtonReg"
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.ArrayButtonReg
    display: flex
    justify-content: space-around
</style>