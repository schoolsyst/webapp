<template>
  <base-card :class="{ '--card-homework': true, expanded }">
    <div class="header">
      <badge-subject
        :color="homework.subject.color"
        editable
        expandable
        @edit="editSubject"
        >{{ homework.subject.name }}</badge-subject
      >
      <p class="title" @input="$emit('input', { title: $event })">
        {{ homework.title }}
      </p>
      <button-icon class="toggle-expand" @click="toggleExpand"
        >keyboard_arrow_down</button-icon
      >
    </div>
    <div class="details">
      <p>{{ homework.details }}</p>
    </div>
    <transition name="slide">
      <div key="1" class="actions" v-if="!editing">
        <button-icon @click="deleteHomework">delete</button-icon>
        <button-icon @click="editHomework">edit</button-icon>
        <text-link
          v-if="homework.quizzes.length > 0"
          :to="`/learn/${homework.uuid}`"
          >Réviser</text-link
        >
      </div>
      <div key="2" class="actions" v-else>
        <button-primary @click="finishEditing" small>OK</button-primary>
      </div>
    </transition>
  </base-card>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
import BaseCard from '~/components/BaseCard.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import ButtonPrimary from '~/components/ButtonPrimary.vue'
import ButtonIcon from '~/components/ButtonIcon.vue'
import TextLink from '~/components/TextLink.vue'
// import '~/types/api-resources'

export default Vue.extend({
  components: { BaseCard, BadgeSubject, ButtonPrimary, ButtonIcon, TextLink },
  props: {
    homework: {
      type: Object,
      required: true,
    } as PropOptions<ApiResourceHomework>,
  },
  data() {
    return {
      editing: false,
      saving: false,
      deleting: false,
      expanded: false,
    }
  },
  methods: {
    editHomework(): void {
      this.editing = true
    },
    async finishEditing(): Promise<void> {
      this.saving = true
      await this.$store.dispatch('homework/edit', { modifications: {} })
      // await this.$store.dispatch('homework/load')
      this.saving = false
      this.editing = false
    },
    editSubject(): void {
      // this.$emit('input', {
      //   subject: this.$pickSubject({ selected: this.homework.uuid }),
      // })
    },
    async deleteHomework(): Promise<void> {
      this.deleting = true
      await this.$store.dispatch('homework/delete', {
        uuid: this.homework.uuid,
      })
      this.deleting = false
    },
    async toggleExpand(): Promise<void> {
      this.expanded = !this.expanded
      if (!this.expanded && this.editing) {
        await this.finishEditing()
      }
    },
  },
})
</script>

<style lang="stylus" scoped>
//
//Definitions
//

//
//Positioning
//
.header
  display flex
  align-items center

.toggle-expand
  margin-left auto

.actions
  display flex
  justify-content end
  align-items center

//
//Sizing
//

.details
  font-size 0.75em

//
//Spacing
//
.title
  margin-left 0.5em

.details
  margin-top 0.5em

.actions
  margin-top 0.5em

.actions > *:not(:last-child)
  margin-right 0.7em

//
//Decoration
//

//
//Colors
//

//
//Typography
//

//
//States
//

//// Expanded/not expanded
.--card-homework, .actions, .details, .toggle-expand
  transition ease 250ms all

.--card-homework:not(.expanded)
  max-height 5.1rem

  .actions
    opacity 0

  .details
    line-clamp 1

  .toggle-expand
    transform rotate(0)

.--card-homework.expanded
  max-height 100rem

  .actions
    opacity 1

  .details
    line-clamp 0


  .toggle-expand
    transform rotate(180deg)


.slide-enter-active, .slide-leave-active
    transition all 250ms ease
.slide-enter, .slide-eave-to
    opacity: 0 !important
</style>
