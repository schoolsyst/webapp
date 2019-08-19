<template lang="pug">
textarea.TextBlockInput
</template>

<script>

export default {
    name: 'TextBlockInput',
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.TextBlockInput
    border-radius: 10px
    width: 100%
    height: 200px
    background: var(--grey)
    margin-top: 10px
    padding: 10px
</style>