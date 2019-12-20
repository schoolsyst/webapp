<template lang="pug">
BaseModal.PickerSubject(:name="name" title="Choisissez une matière..." edge-to-edge)
    ul.subjects
      li(v-for="subject in subjects" :key="subject.uuid")
        BadgeSubject(
          v-bind="subject",
          @click="$emit('pick', subject); $modal.hide(name)"
          clickable, multiline
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
  
ul.subjects
  width: 100%
  list-style: none
  //TODO: ↓ Not sure about this
  @media (max-width: 650px)
    display: grid
    grid-template-columns: repeat(2, 1fr)

li > .subject
  border-radius: 0 !important // !important needed to overwrite it
  height: 3.25rem
  @media (max-width: 650px)
    height: 5rem
  font-size: 1.1rem
  width: 100%
  
</style>
