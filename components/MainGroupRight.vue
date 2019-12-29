<template lang="pug">
section.MainGroupRight: slot
</template>

<script>
export default {
  name: "MainGroupRight",
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
+desktop
    .MainGroupRight
        grid-column: 2
</style>