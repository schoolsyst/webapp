<template lang="pug">
BaseButtonReg.ButtonRegPrimary(:role="role")
    slot
</template>

<script>
import BaseButtonReg from '~/components/BaseButtonReg.vue'

export default {
    name: 'ButtonRegPrimary',
    components: {
        BaseButtonReg
    },
    props: {
        role: {
            type: String,
            default: "normal"
        }
    }
}
</script>

<style lang="sass">
@import '~/assets/defaults'

.ButtonRegPrimary
    background-color: var(--blue)
    &[role="danger"]
        background-color: var(--red)
    color: #ffffff
    &.inverted-colors
        background: #fff
        color: var(--blue)
        &[role="danger"]
            color: var(--red)
</style>