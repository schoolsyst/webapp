<template lang="pug">
BaseModal.ModalAddSubject(name="add-subject")
    CardSubject.editing(v-bind="subject" @editing-finished="addSubject")
</template>

<script>
import CardSubject from '~/components/CardSubject.vue'
import BaseModal from '~/components/BaseModal.vue'
export default {
    name: 'ModalAddSubject',

    components: {
        BaseModal, CardSubject
    },

    props: {
        subject: Object
    },

    methods: {
        addSubject() {
            document.querySelector('#modal_add-subject').classList.remove('opened')
        },
    },
}
</script>

<style lang="stylus" scoped>
.BaseModal /deep/ .modal-wrapper
    padding: 0 // <CardSubject> already takes care of the padding
</style>