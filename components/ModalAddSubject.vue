<template lang="pug">
BaseModal.ModalAddSubject
    CardSubject(v-bind="subject")
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
}
</script>

<style lang="stylus" scoped>

</style>