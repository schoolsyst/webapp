<template lang="pug">
  BaseModal(v-bind="modalOpts")
    form(@submit.prevent="$emit('submit'); closeModal()")
      slot
      .submit-area
        ButtonNormal(
          v-if="action === 'edit'"
          variant="secondary"
          role="danger"
          type="button"
          @click="$emit('delete'); closeModal()"
        ) Supprimer
        ButtonNormal(
          v-bind="{ validation }"
          variant="primary"
          type="submit"
        ) {{ verboseAction }}
</template>

<script>
import BaseModal from '~/components/BaseModal.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'

export default {
  components: { BaseModal, ButtonNormal },
  props: {
    name: {
      type: String,
      required: true
    },
    verboseName: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true,
      validator: (gender) => ['M', 'F'].includes(gender)
    },
    action: {
      type: String,
      default: 'add',
      validator: (action) => ['add', 'edit'].includes(action)
    },
    validation: {
      type: Object,
      default: () => ({ validated: true, errors: {} })
    }
  },
  computed: {
    modalOpts() {
      const name = this.action + '-' + this.name
      const title =
        this.verboseAction +
        ' ' +
        (this.gender === 'M' ? 'un' : 'une') +
        ' ' +
        this.verboseName

      return { name, title }
    },
    verboseAction() {
      return {
        add: 'Ajouter',
        edit: 'Modifier'
      }[this.action]
    }
  },
  methods: {
    closeModal() {
      this.$modal.close(this.modalOpts.name)
    }
  }
}
</script>

<style lang="stylus" scoped>
.submit-area
  display: flex
  justify-content: flex-end
</style>
