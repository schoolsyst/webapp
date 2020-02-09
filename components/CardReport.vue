<template lang="pug">
  .card.report(:class="`type-is-${type.toLowerCase()}`")
    .text
      p.top-line
        template(v-if="github_issue") \#{{ github_issue }} &middot; 
        | {{ verboseType }}
      p.title {{ title }}
      p.published(v-if="published") Soumis le {{ verbosePublished || published }}
      p.published(v-else) Non publié
    ul.actions
      li(v-if="issueHref && published")
        ButtonNormal(variant="outline" :href="issueHref" small)
          Icon open_in_new
          | Voir sur GitHub
</template>

<script>
import { format, isValid } from 'date-fns'
import ButtonNormal from '~/components/ButtonNormal.vue'
import Icon from '~/components/Icon.vue'

export default {
  components: { ButtonNormal, Icon },
  props: {
    title: {
      type: String,
      required: true
    },
    // eslint-disable-next-line vue/prop-name-casing
    github_issue: {
      type: Number,
      default: null
    },
    published: {
      type: Date,
      default: null
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      verboseTypes: {
        FEATURE: 'Fonctionnalité',
        BUG: 'Bug'
      }
    }
  },
  computed: {
    issueHref() {
      if (this.github_issue) {
        return `https://github.com/schoolsyst/frontend/issues/${this.github_issue}`
      } else {
        return null
      }
    },
    verbosePublished() {
      console.log(`verbosePublished: this.published=${this.published}`)
      if (!this.published || !isValid(this.published)) return null
      return format(this.published, 'dd/MM/yyyy')
    },
    verboseType() {
      return this.verboseTypes[this.type]
    }
  }
}
</script>

<style lang="stylus" scoped>

//
// Definitions
//


//
// Layout
//

.card
  display flex
  align-items center
  padding 1em
  width 50rem
  max-width calc(100% - 2em)

.actions
  margin-left auto

.actions .button /deep/ .btn
  margin-right: 0

.title
  display flex
  align-items center

.top-line
  font-size: 0.85em

//
// Decoration
//

.card
  border 1px solid
  border-radius var(--border-radius)

//
// Colors
//

.card
  border-color var(--grey)

.published
  color var(--grey)

.top-line
  color var(--grey-light)

//
// Typography
//

.text
  text-align left

.top-line
  text-transform uppercase
  font-weight bold
  letter-spacing .1em

//
// Reactions
//
</style>
