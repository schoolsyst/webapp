<template lang="pug">
BaseModal.PickerSubject(:name="`${parentModal}-subject-picker`" :class="{'dots':dots}")
    //TODO: prop "first" (subject.slug) use as the first one in the forloop
    //TODO: choose orientation from screen remaining 
    template(v-if="dots")
        SubjectDot(
            v-for="subject in subjects" :key="subject.id"
            v-bind="subject",
            @mouseup.native="$emit('pick', subject)"
            close-modal,
        )
    template(v-else)
        BadgeSubject(
            v-for="subject in subjects" :key="subject.id"
            v-bind="subject",
            @mouseup.native="$emit('pick', subject)"
            close-modal,
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
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
//!importants are needed to override the BaseModal's styling
.PickerSubject
  z-index: 2000 !important

.PickerSubject
  /deep/ .modal-wrapper
    grid-gap: 0
    padding: 0 !important
    +shadow(3)

// badges (default)
.PickerSubject:not(.dots) /deep/ .modal-wrapper
  overflow: hidden
  display: grid
  grid-template-columns: repeat(4, 1fr)
  +phone
    grid-template-columns: repeat(3, 1fr)

// dots
.PickerSuject.dots /deep/ .modal-wrapper
  display: flex
  overflow-x: scroll
  flex-direction: row
  background: transparent

.BadgeSubject
    border-radius: 0 !important // !important needed to overwrite it

.BadgeSubject, .SubjectDot
    cursor: pointer

.BaseModal.opened
    background: rgba(0, 0, 0, 0)
.BaseModal
    transition: box-shadow .125s ease
    // animation: none
</style>