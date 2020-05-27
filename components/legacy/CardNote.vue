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
          BadgeSubject(v-bind="subject" variant="dot").subject-color
          span.subject-name {{ subject.name }}
          span.more(@click.prevent="$emit('more', $event)"): Icon more_vert
</template>

<script>
import Icon from '~/components/legacy/Icon.vue'
import BadgeSubject from '~/components/legacy/BadgeSubject.vue'
export default {
  components: { Icon, BadgeSubject },
  props: {
    uuid: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: Object,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
.card
  display flex
  flex-direction column
  overflow hidden
  width 225px
  height 310px
  transition all 0.25s ease

.preview
  overflow hidden
  //Dimensions & spacing
  padding 15px
  width 100%
  height 75%
  //Borders
  border 1px solid var(--grey-light)
  border-bottom none
  border-radius var(--border-radius)
  border-bottom-right-radius 0
  border-bottom-left-radius 0
  //Colors
  background var(--grey-offset)
  //Text
  font-size 0.5rem
  line-height 1.2em

.format-is-link .preview
  display flex
  flex-direction column
  justify-content center
  align-items center
  //Colors
  color var(--grey-dark)
  text-overflow ellipsis
  //Layout
  word-break break-all
  font-size 1rem
  //Text
  font-family var(--fonts-monospace-light)

.infos
  padding 15px
  //Dimensions & spacing
  height 25%
  //Borders
  border 1px solid var(--grey-light)
  border-radius var(--border-radius)
  border-top-left-radius 0
  border-top-right-radius 0

.name
  //Layout
  display inline-block
  overflow hidden
  margin-bottom 0.2rem
  width 100%
  //Dimensions & spacing
  height 1.2em
  text-overflow ellipsis
  white-space nowrap
  //Text
  font-size 1rem

  &.untitled
    opacity 0.5

.info
  //Layout
  display flex
  align-items center

  .subject-name
    //Layout
    display inline-block
    //Text
    overflow hidden
    width calc(100% - 0.4em) //Parent width - subject color margin
    text-overflow ellipsis
    white-space nowrap

  .subject-color
    flex-shrink 0
    //Dimensions & spacing
    margin-right 0.4em

.card:hover
  .preview
    background var(--grey)

  .infos
    background var(--grey-offset)

@media (max-width: 600px)
  .card
    width 100%
    border solid 1px var(--grey)

    .preview, .infos
      border none
      border-radius 0

@media (max-width: 350px)
  .card-wrapper
    width 100vw
</style>
