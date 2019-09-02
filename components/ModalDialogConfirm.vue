<template lang="pug">
BaseModal.ModalDialogConfirm(:name="`confirm-${name}`", show-close-button)
    p.heading {{heading}}
    p.message: slot
    ArrayButtonReg.buttons
        ButtonRegSecondary(close-modal) {{cancelText}}
        ButtonRegPrimary(@click.native="confirmAndClose", :role="confirmRole") {{confirmText}}
</template>

<script>
import ButtonRegPrimary from '~/components/ButtonRegPrimary.vue'
import ButtonRegSecondary from '~/components/ButtonRegSecondary.vue'
import ArrayButtonReg from '~/components/ArrayButtonReg.vue'
import BaseModal from '~/components/BaseModal.vue'
export default {
    name: 'ModalDialogConfirm',
    components: {ButtonRegPrimary,ButtonRegSecondary,BaseModal,ArrayButtonReg},
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
        confirmRole: {
            type: String,
            default: "normal"
        },
        name: String
    },
    methods: {
        confirmAndClose() {
            this.$emit('confirm')
            document.querySelector(`#modal_confirm-${this.name}`).classList.remove('opened')
        }
    }
}
</script>

<style lang="stylus" scoped>
.ModalDialogConfirm /deep/ .modal-wrapper
    max-width 500px
.buttons
    margin-top 20px
.heading, .message
    color #000
    text-align center
.heading
    font-size 30px
    font-weight bold
    margin-bottom 20px
.message
    line-height 1.2
</style>