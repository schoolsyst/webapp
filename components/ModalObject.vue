<template lang="pug">
  BaseModal(v-bind="modalOpts" @close="$emit('close')")
    form(@submit.prevent="handleFormSubmit")
      slot
      .submit-area
        ButtonNormal(
          v-if="action === 'edit' && deleteButtonText"
          variant="outline"
          role="danger"
          type="button"
          @click="$emit('delete'); closeModal()"
        ) {{ deleteButtonText }}
        ButtonNormal(
          v-if="verboseAction"
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
      required: true,
    },
    verboseName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      validator: gender => ['M', 'F'].includes(gender),
    },
    action: {
      type: String,
      required: true,
      validator: action => ['add', 'edit'].includes(action),
    },
    validation: {
      type: Object,
      default: () => ({ validated: true, errors: {} }),
    },
    addButtonText: {
      type: String,
      default: 'Ajouter',
    },
    editButtonText: {
      type: String,
      default: 'Modifier',
    },
    deleteButtonText: {
      type: String,
      default: 'Supprimer',
    },
    modalTitle: {
      type: String,
      default: null,
    },
    closeOnFormSubmit: {
      type: Boolean,
      default: true,
    },
    closeButton: {
      type: Boolean,
      default: true,
    },
    noHeader: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    modalOpts() {
      const name = this.action + '-' + this.name
      const title = this.noHeader
        ? null
        : this.modalTitle ||
          this.verboseAction +
            ' ' +
            (this.gender === 'M' ? 'un' : 'une') +
            ' ' +
            this.verboseName

      return { name, title, closeButton: this.closeButton }
    },
    verboseAction() {
      return {
        add: this.addButtonText,
        edit: this.editButtonText,
      }[this.action]
    },
  },
  methods: {
    closeModal() {
      this.$modal.close(this.modalOpts.name)
    },
    handleFormSubmit() {
      this.$emit('submit')
      if (this.closeOnFormSubmit) {
        this.closeModal()
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.submit-area
  display flex
  justify-content flex-end
  margin-top 2em
</style>
