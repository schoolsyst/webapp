<template lang="pug">
.card-wrapper
  nuxt-link.card(:to="`/notes/${uuid}`")
    //- substring(1, ...) 1 because we get rid of the note's h1
    pre.preview {{ content.substring(1, 1000) }}
    .infos
      span.name(:title="name") {{ name }}
      span.info(:title="subject.name")
        SubjectDot(v-bind="subject").subject-color
        span.subject-name {{ subject.name }}
        span.more(@click.prevent="$emit('more')"): Icon more_vert
</template>

<script>
import Icon from '~/components/Icon.vue'
import SubjectDot from '~/components/SubjectDot.vue'
export default {
  components: { Icon, SubjectDot },
  props: {
    content: String,
    name: String,
    subject: Object,
    uuid: String
  },
  computed: {
    openContextMenu() {
      if(this.$refs.hasOwnProperty('menu')) {
        return this.$refs.menu.open
      } else {
        console.log('oops')
        return null
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.card
  overflow hidden
  height: 310px
  width: 225px
  display flex
  flex-direction column
  transition all 0.25s ease
.preview
  // Dimensions & spacing
  padding 15px
  height: 75%
  width 100%
  // Text
  font-size 0.5rem
  overflow: hidden
  font-family var(--fonts-monospace-light)
  line-height 1.2em
  // Colors
  background var(--offset-grey)
  // Borders
  border 1px solid var(--grey-light)
  border-radius var(--border-radius)
  border-bottom-left-radius 0
  border-bottom-right-radius 0
  border-bottom none
.infos
  // Dimensions & spacing
  height: 25%
  padding: 15px
  // Borders
  border 1px solid var(--grey-light)
  border-radius var(--border-radius)
  border-top-left-radius 0
  border-top-right-radius 0
.name
  // Dimensions & spacing
  height: 1.2em
  margin-bottom 0.2rem
  // Layout
  display inline-block
  // Text
  font-size 1rem
  overflow hidden
  text-overflow ellipsis
  width 100%
  white-space nowrap
.info
  // Layout
  display flex
  align-items center
  .subject-name
    // Layout
    display inline-block
    // Text
    overflow hidden
    text-overflow ellipsis
    width calc(100% - 0.4em) // Parent width - subject color margin
    white-space nowrap
  .subject-color
    // Dimensions & spacing
    margin-right 0.4em
    flex-shrink 0
.card:hover
  .preview
    background var(--grey)
  .infos
    background var(--offset-grey)
</style>
