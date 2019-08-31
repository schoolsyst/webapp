<template lang="pug">
BaseModal.ModalDialogConfirm(:name="`confirm-${name}`", show-close-button)
    p.heading {{heading}}
    p.message: slot
    ArrayButtonReg.buttons
        ButtonRegSecondary(close-modal) {{cancelText}}
        ButtonRegDangerPrimary(@click="$emit('confirm')") {{confirmText}}
</template>

<script>
import ButtonRegDangerPrimary from '~/components/ButtonRegDangerPrimary.vue'
import ButtonRegSecondary from '~/components/ButtonRegSecondary.vue'
import ArrayButtonReg from '~/components/ArrayButtonReg.vue'
import BaseModal from '~/components/BaseModal.vue'
export default {
    name: 'ModalDialogConfirm',
    components: {ButtonRegDangerPrimary,ButtonRegSecondary,BaseModal,ArrayButtonReg},
    props: {
        heading: {
            type: String,
            default: "Êtes-vous sûr ?"
        },
        confirmText: {
            type: String,
            default: "Confirmer"
        },
        cancelText: {
            type: String,
            default: "Annuler"
        },
        name: String
    }
}
</script>

<style lang="stylus" scoped>
.buttons
    margin-top: 20px
.heading, .message
    color #000
    text-align center
.heading
    font-size: 30px
    font-weight bold
    margin-bottom: 20px
</style>