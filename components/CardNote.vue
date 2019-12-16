<template lang="pug">
.card-wrapper
    component.card(
      :is="format === 'LINK' ? 'a' : 'nuxt-link'" 
      :to="`/notes/${uuid}`" 
      :href="format === 'LINK' ? content : `/notes/${uuid}`"
      :class="`format-is-${format.toLowerCase()}`"
    )
      p.preview(
        v-html="\
          (\
            format === 'LINK' \
            ? '<em>Lien externe:</em> <br>' \
            : ''\
          )\
          + content\
        "
      )
      .infos
        span.name(:title="name" :class="{'untitled': !name}") {{ name || '(Document sans titre)' }}
        span.info(:title="subject.name")
          SubjectDot(v-bind="subject").subject-color
          span.subject-name {{ subject.name }}
          span.more(@click.prevent="$emit('more')"): Icon more_vert
</template>

<script>
import Icon from '~/components/Icon.vue'
import SubjectDot from '~/components/SubjectDot.vue'
import { mapGetters } from 'vuex'
export default {
  components: { Icon, SubjectDot },
  props: {
    uuid: String,
  },
  data() {
    return {
      content: "",
      name: null,
      subject: {
        name: '',
        color: 'black'
      },
      format: ''
    }
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
  },
  methods: mapGetters('notes', ['one']),
  mounted() {
    const note = this.one()(this.uuid)
    console.log(note)
    this.content = note.content
    this.subject = note.subject
    this.name = note.name
    this.format = note.format
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
  line-height 1.2em
  // Colors
  background var(--grey-offset)
  // Borders
  border 1px solid var(--grey-light)
  border-radius var(--border-radius)
  border-bottom-left-radius 0
  border-bottom-right-radius 0
  border-bottom none
.format-is-link .preview
  // Text
  font-family var(--fonts-monospace-light)
  font-size: 1rem
  // Layout
  word-break break-all
  text-overflow ellipsis
  display flex
  align-items center
  justify-content center
  flex-direction column
  // Colors
  color var(--grey-dark)

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
  &.untitled
    opacity: 0.5
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
    background var(--grey-offset)

@media (max-width 600px)
  .card-wrapper
    width 50vw
  .card
    border solid 1px var(--grey)
    width: 100%
    .preview, .infos
      border-radius 0
      border none
@media (max-width: 350px)
  .card-wrapper
    width 100vw
</style>
