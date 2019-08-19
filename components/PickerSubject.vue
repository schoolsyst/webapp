<template lang="pug">
BaseModal.PickerSubject(:name="`subject-picker-${parentModal}`")
    template(v-if="dots")
        SubjectDot(
            v-for="subject in subjects" :key="subject.id"
            v-bind="subject"
            close-modal
        )
    template(v-else)
        BadgeSubject(
            v-for="subject in subjects" :key="subject.id"
            v-bind="subject"
            close-modal
        )

</template>

<script>
import BaseModal from "~/components/BaseModal.vue";
import BadgeSubject from "~/components/BadgeSubject.vue";
import SubjectDot from "~/components/SubjectDot.vue";
import { mapGetters } from "vuex";

export default {
  name: "PickerSubject",
  components: { BaseModal, BadgeSubject, SubjectDot },
  props: {
    parentModal: String,
    dots: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      subjects: "subjects"
    })
  },
  mounted() {
    //@click does not work
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.PickerSubject
    z-index: 2000
/deep/ .modal-wrapper
    display: grid
    grid-gap: 0
    padding: 0
    overflow: hidden
    grid-template-columns: repeat(4, 1fr)

.BadgeSubject
    border-radius: 0

.BadgeSubject, .SubjectDot
    cursor: pointer

.BaseModal.opened
    background: rgba(0, 0, 0, 0)
    .modal-wrapper
        +shadow(5)
.BaseModal
    transition: box-shadow .125s ease
    // animation: none
</style>