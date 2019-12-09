<template lang="pug">
BaseModal.ModalDialogConfirm(:name="`confirm-${name}`", show-close-button)
    p.heading {{heading}}
    p.message: slot
    ArrayButtonReg.buttons(v-if="!challengeOpened")
        ButtonNormal(variant="secondary" close-modal) {{cancelText}}
        ButtonNormal(variant="primary" @click="challenge ? startChallenge() : confirmAndClose()", :role="confirmRole") {{confirmText}}
    .challenge(:class="{'errored': challengeError}" v-else)
        LabelFlat(:for="`confirm-${name}-challenge`") {{challengeMessage}}
        .inputs
            ButtonIcon(@click="challengeOpened = false; challengeInput = ''" color="black") arrow_back
            InputFlat(type="text" v-model="challengeInput" :name="`confirm-${name}-challenge`")
            ButtonIcon(@click="challenge(challengeInput) ? confirmAndClose() : challengeError = true" color="black") check
</template>

<script>
import ButtonRegPrimary from "~/components/ButtonRegPrimary.vue"
import ButtonRegSecondary from "~/components/ButtonRegSecondary.vue"
import ArrayButtonReg from "~/components/ArrayButtonReg.vue"
import BaseModal from "~/components/BaseModal.vue"
import LabelFlat from "~/components/LabelFlat.vue"
import InputFlat from "~/components/InputFlat.vue"
import ButtonIcon from "~/components/ButtonIcon.vue"
import ButtonNormal from '~/components/ButtonNormal.vue'
export default {
  name: "ModalDialogConfirm",
  components: {
    ButtonRegPrimary,
    ButtonRegSecondary,
    BaseModal,
    ArrayButtonReg,
    LabelFlat,
    InputFlat,
    ButtonIcon,
    ButtonNormal
  },
  props: {
    heading: {
      type: String,
      default: "Êtes-vous sûr ?",
    },
    confirmText: {
      type: String,
      default: "Confirmer",
    },
    cancelText: {
      type: String,
      default: "Annuler",
    },
    confirmRole: {
      type: String,
      default: "normal",
    },
    name: String,
    challenge: {
      type: [Boolean, Function],
      default: false,
    },
    challengeMessage: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      challengeInput: "",
      challengeOpened: false,
      challengeError: false,
    }
  },
  methods: {
    confirmAndClose() {
      this.endChallenge()
      this.$emit("confirm")
      document
        .querySelector(`#modal_confirm-${this.name}`)
        .classList.remove("opened")
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
.ModalDialogConfirm /deep/ .modal-wrapper {
  padding-top: 30px
  max-width: 500px;
}

.buttons {
  margin-top: 20px;
}

.heading, .message {
  color: var(--black);
  text-align: center;
}

.heading {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
}

.message {
  line-height: 1.2;
}

.challenge.errored .InputFlat /deep/ input {
  background: var(--red);
  color: white;
}

.challenge {
  overflow: hidden;

  .inputs {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    margin-bottom: 15px;
    margin-top: 25px;
    color: black;
  }

  .InputFlat {
    // padding: 0
    max-width: calc(3 / 4 * 500px);
  }

  .InputFlat /deep/ input {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 7.5px;
  }

  .ButtonIcon, .ButtonIcon /deep/ button {
    width: 30px;
  }
}
</style>
