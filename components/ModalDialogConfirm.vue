<template lang="pug">
BaseModal.ModalDialogConfirm(:name="`confirm-${name}`", show-close-button)
    p.heading {{heading}}
    p.message: slot
    ArrayButtonReg.buttons(v-if="!challengeOpened")
        ButtonRegSecondary(close-modal) {{cancelText}}
        ButtonRegPrimary(@click.native="challenge ? startChallenge() : confirmAndClose()", :role="confirmRole") {{confirmText}}
    .challenge(:class="{'errored': challengeError}" v-else)
        LabelFlat {{challengeMessage}}
        InputFlat(type="text" v-model="challengeInput")
        ButtonIcon(@click="challenge(challengeInput) ? confirmAndClose() : challengeError = true") check
</template>

<script>
import ButtonRegPrimary from '~/components/ButtonRegPrimary.vue'
import ButtonRegSecondary from '~/components/ButtonRegSecondary.vue'
import ArrayButtonReg from '~/components/ArrayButtonReg.vue'
import BaseModal from '~/components/BaseModal.vue'
import LabelFlat from '~/components/LabelFlat.vue'
import InputFlat from '~/components/InputFlat.vue'
import ButtonIcon from '~/components/ButtonIcon.vue'
export default {
    name: 'ModalDialogConfirm',
    components: {ButtonRegPrimary,ButtonRegSecondary,BaseModal,ArrayButtonReg,LabelFlat,InputFlat,ButtonIcon},
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
        name: String,
        challenge: {
            type: [Boolean, Function],
            default: false
        },
        challengeMessage: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            challengeInput: '',
            challengeOpened: false,
            challengeError: false,
        }
    },
    methods: {
        confirmAndClose() {
            this.endChallenge()
            this.$emit('confirm')
            document.querySelector(`#modal_confirm-${this.name}`).classList.remove('opened')
        },
        startChallenge() {
            console.log(`[MODAL confirm-${name}] starting challenge`)
            this.challengeError = false
            this.challengeOpened = true
        },
        endChallenge() {
            this.challengeOpened = false
            this.challengeError = false
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
.challenge.errored
    background var(--red)
</style>