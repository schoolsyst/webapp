<template lang="pug">
BaseButtonReg.ButtonRegDangerPrimary
    slot
</template>

<script>
import BaseButtonReg from '~/components/BaseButtonReg.vue'

export default {
    name: 'ButtonRegDangerPrimary',
    components: {
        BaseButtonReg
    },
}
</script>

<style lang="sass">
@import '~/assets/defaults'

.ButtonRegDangerPrimary
    background-color: var(--red)
    color: #ffffff
    &.inverted-colors
        background: #fff
        color: var(--red)
</style>