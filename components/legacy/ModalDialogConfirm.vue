<template lang="pug">
//TODO: Rewrite this
//TODO: default styles for ul's inside slot, not centered.
//TODO?: no text-align:center on slot, let the consumer decide
//TODO: center btns on mobile
BaseModal.ModalDialogConfirm(:name="`confirm-${name}`", :title="heading || 'Confirmation'")
    p.message: slot
    ul.buttons(v-if="!challengeOpened")
        li: ButtonNormal(
          variant="outline"
          :role="cancelRole"
          @click="$modal.close(`confirm-${name}`)") {{cancelText}}
        li: ButtonNormal(
          variant="primary"
          :role="confirmRole"
          @click="challenge ? startChallenge() : confirmAndClose()"
        ) {{confirmText}}
    .challenge(:class="{'errored': challengeError}" v-else)
        LabelFlat(:for="`confirm-${name}-challenge`") {{challengeMessage}}
        .inputs
            ButtonIcon(@click="challengeOpened = false; challengeInput = ''" color="black") arrow_back
            InputFlat(type="text" v-model="challengeInput" :name="`confirm-${name}-challenge`")
            ButtonIcon(@click="challenge(challengeInput) ? confirmAndClose() : challengeError = true" color="black") check
</template>

<script>
import BaseModal from '~/components/legacy/BaseModal.vue'
import ButtonNormal from '~/components/legacy/ButtonNormal.vue'
export default {
  name: 'ModalDialogConfirm',
  components: {
    BaseModal,
    ButtonNormal,
  },
  props: {
    heading: {
      type: String,
      default: 'Êtes-vous sûr ?',
    },
    confirmText: {
      type: String,
      default: 'Confirmer',
    },
    cancelText: {
      type: String,
      default: 'Annuler',
    },
    confirmRole: {
      type: String,
      default: 'normal',
    },
    cancelRole: {
      type: String,
      default: 'normal',
    },
    closeOnConfirm: {
      type: Boolean,
      default: true,
    },
    name: String,
    challenge: {
      type: [Boolean, Function],
      default: false,
    },
    challengeMessage: {
      type: String,
      default: '',
    },
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
      if (this.closeOnConfirm) {
        this.$modal.hide(`confirm-${this.name}`)
      }
    },
    startChallenge() {
      // console.log(`[MODAL confirm-${name}] starting challenge`)
      this.challengeError = false
      this.challengeOpened = true
    },
    endChallenge() {
      this.challengeOpened = false
      this.challengeError = false
    },
  },

  watch: {
    challengeInput() {
      if (!this.challengeInput) {
        this.challengeError = false
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.ModalDialogConfirm /deep/ .modal-wrapper
  max-width 500px

.buttons
  display flex
  justify-content flex-end
  margin-top 2.5em

.heading, .message
  color var(--black)
  text-align center

.heading
  margin-bottom 20px
  font-weight bold
  font-size 30px

.message
  line-height 1.2

.challenge.errored .InputFlat /deep/ input
  background var(--red)
  color white

.challenge
  overflow hidden

  .inputs
    display flex
    justify-content center
    align-items center

  label
    margin-top 25px
    margin-bottom 15px
    color black

  .InputFlat
    //padding: 0
    max-width calc(3 / 4 * 500px)

  .InputFlat /deep/ input
    border-radius 7.5px
    background rgba(0, 0, 0, 0.05)

  .ButtonIcon, .ButtonIcon /deep/ button
    width 30px
</style>
