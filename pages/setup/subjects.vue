<template lang="pug">
  .container
    ModalAddSubject(v-model="newSubject")
    h1 Ajoutez vos matières.
    button.add(@click="$modal.show('add-subject')"): Icon add
    ul.subjects
      li(v-for="subject in all" :key="subject.uuid")
        CardSubject(@click="$modal.show('edit-subject')" v-bind="subject")
    .bottom-bar
      .progress 1 #[span.slash /] 3
      ButtonNormal.continue(variant="primary" href="/setup/settings") Continuer
</template>

<script>
import ModalAddSubject from '~/components/ModalAddSubject.vue'
import CardSubject from '~/components/CardSubject.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import Icon from '~/components/Icon.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { ModalAddSubject, CardSubject, ButtonNormal, Icon },
  layout: 'bare',
  data() {
    return {
      newSubject: {
        color: '#000000',
        name: null,
        weight: null
      }
    }
  },
  computed: {
    ...mapGetters('subjects', ['all'])
  },
  methods: {
    ...mapActions('subjects', ['post', 'patch'])
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('subjects/load')
    })
  }
}
</script>

<style lang="stylus" scoped>
.container
  display flex
  justify-content center
  align-items center
  flex-direction column
.add /deep/ i
  font-size 5em
  padding 1em
ul.subjects 
  display flex
  flex-wrap wrap
  flex-shrink 0
  flex-grow 0
  max-width 1000px
  @media (max-width 1000px)
    max-width 100vw
  justify-content center
  align-items center
  spacing = 1.5em
  li
    width: "calc(450px + %s)" % spacing
    margin-bottom spacing
  li:last-child
    flex-grow 1
    margin-left spacing
.bottom-bar
  padding 2em
  position fixed
  bottom: 0
  right: 0
  left: 0
  display flex
  align-items center
  .progress
    font-family var(--fonts-monospace)
    font-size: 1.3em
    .slash
      color var(--grey-dark)
  .continue
    margin-left auto
</style>
