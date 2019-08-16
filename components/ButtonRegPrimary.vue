<template lang="pug">
BaseButtonReg.ButtonRegPrimary
    slot
</template>

<script>
import BaseButtonReg from '~/components/BaseButtonReg.vue'

export default {
    name: 'ButtonRegPrimary',
    components: {
        BaseButtonReg
    },
}
</script>

<style lang="sass">
@import '~/assets/defaults'

.ButtonRegPrimary
    background-color: var(--blue)
    color: #ffffff
    &.inverted-colors
        background: #fff
        color: var(--blue)
</style>