<template lang="pug">
  .container
    ModalAddSubject(v-model="newSubject" @post="post({subject: $event})")
    h1 Ajoutez vos matières.
    button.add(@click="$modal.show('add-subject')"): Icon add
    ul.subjects
      li(v-for="subject in all" :key="subject.uuid")
        CardSubject(@click="$modal.show('edit-subject')" v-bind="subject")
    TheBottomBar
      ButtonNormal(variant="text-blue" href="/logout") #[Icon cancel] Annuler
      ButtonNormal.to-right(variant="primary" href="/setup/settings") Continuer
</template>

<script>
import ModalAddSubject from '~/components/ModalAddSubject.vue'
import TheBottomBar from '~/components/TheBottomBar.vue'
import CardSubject from '~/components/CardSubject.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import Icon from '~/components/Icon.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { ModalAddSubject, CardSubject, ButtonNormal, Icon, TheBottomBar },
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
</style>
