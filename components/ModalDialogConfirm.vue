<template lang="pug">
//TODO: Rewrite this
//TODO: default styles for ul's inside slot, not centered.
//TODO?: no text-align:center on slot, let the consumer decide
//TODO: center btns on mobile
BaseModal.ModalDialogConfirm(:name="`confirm-${name}`", :title="heading || 'Confirmation'")
    p.message: slot
    ul.buttons(v-if="!challengeOpened")
        li: ButtonNormal(variant="outline" @click="$modal.close(`confirm-${name}`)") {{cancelText}}
        li: ButtonNormal(variant="primary" @click="challenge ? startChallenge() : confirmAndClose()", :role="confirmRole") {{confirmText}}
    .challenge(:class="{'errored': challengeError}" v-else)
        LabelFlat(:for="`confirm-${name}-challenge`") {{challengeMessage}}
        .inputs
            ButtonIcon(@click="challengeOpened = false; challengeInput = ''" color="black") arrow_back
            InputFlat(type="text" v-model="challengeInput" :name="`confirm-${name}-challenge`")
            ButtonIcon(@click="challenge(challengeInput) ? confirmAndClose() : challengeError = true" color="black") check
</template>

<script>
import BaseModal from '~/components/BaseModal.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
export default {
  name: 'ModalDialogConfirm',
  components: {
    BaseModal,
    ButtonNormal
  },
  props: {
    heading: {
      type: String,
      default: 'Êtes-vous sûr ?'
    },
    confirmText: {
      type: String,
      default: 'Confirmer'
    },
    cancelText: {
      type: String,
      default: 'Annuler'
    },
    confirmRole: {
      type: String,
      default: 'normal'
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
      challengeError: false
    }
  },
  methods: {
    confirmAndClose() {
      this.endChallenge()
      this.$emit('confirm')
      this.$modal.hide(`confirm-${this.name}`)
    },
    startChallenge() {
      // console.log(`[MODAL confirm-${name}] starting challenge`)
      this.challengeError = false
      this.challengeOpened = true
    },
    endChallenge() {
      this.challengeOpened = false
      this.challengeError = false
    }
  },

  watch: {
    challengeInput() {
      if (!this.challengeInput) {
        this.challengeError = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.ModalDialogConfirm /deep/ .modal-wrapper
  max-width: 500px

.buttons
  margin-top: 2.5em
  display: flex
  justify-content: flex-end

.heading, .message
  color: var(--black)
  text-align: center

.heading
  font-size: 30px
  font-weight: bold
  margin-bottom: 20px

.message
  line-height: 1.2

.challenge.errored .InputFlat /deep/ input
  background: var(--red)
  color: white

.challenge
  overflow: hidden

  .inputs
    display: flex
    align-items: center
    justify-content: center

  label
    margin-bottom: 15px
    margin-top: 25px
    color: black

  .InputFlat
    // padding: 0
    max-width: calc(3 / 4 * 500px)

  .InputFlat /deep/ input
    background: rgba(0, 0, 0, 0.05)
    border-radius: 7.5px

  .ButtonIcon, .ButtonIcon /deep/ button
    width: 30px
</style>
