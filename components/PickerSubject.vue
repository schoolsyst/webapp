<template lang="pug">
BaseModal.PickerSubject(:name="name")
    span.heading Choisissez une matière...
    ul.subjects
      li(v-for="subject in subjects" :key="subject.id")
        BadgeSubject(
          v-bind="subject",
          @click="$emit('pick', subject); $modal.hide(name)"
          clickable
        )

</template>

<script>
import BaseModal from "~/components/BaseModal.vue"
import BadgeSubject from "~/components/BadgeSubject.vue"
import { mapGetters } from "vuex"

export default {
  name: "PickerSubject",
  components: { BaseModal, BadgeSubject },
  props: {
    parentModal: {
      type: String,
      default: null
    },
  },
  computed: {
    ...mapGetters({
      subjects: "subjects/all",
    }),
    name() {
      return this.parentModal ? `${this.parentModal}-subject-picker` : 'subject-picker'
    }
  },
  async mounted() {
    await this.$store.dispatch('subjects/load')
  }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
//!importants are needed to override the BaseModal's styling
.PickerSubject
  z-index: 2000 !important

.PickerSubject
  /deep/ .v--modal-box
    padding: 0 !important
    +shadow(3)
    width: auto
    overflow: auto

.subjects
  width: 100%
  list-style: none

.heading
  font-size: 1.75rem
  line-height: 1.75rem
  padding: 2rem // Restore padding since it's remove from the parent div for the edge-to-edge subject badges
  flex-grow: 0
  display: block

.BadgeSubject
    border-radius: 0 !important // !important needed to overwrite it
    height: 3.25rem
    @media (max-width: 650px)
      height: 5rem
    font-size: 1.1rem
    width: 100%

.BadgeSubject, .SubjectDot
    cursor: pointer

.BaseModal.opened
    background: rgba(0, 0, 0, 0)
.BaseModal
    transition: box-shadow .125s ease
    // animation: none
</style>
