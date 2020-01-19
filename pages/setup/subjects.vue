<template lang="pug">
  .container
    ModalAddSubject(v-model="newSubject" @post="post({subject: $event})")
    h1 Ajoutez vos matières.
    p.help Ajoutez toutes les matières qui sont dans votre emploi du temps,#[br]même celles dans lesquelles vous n'aurez pas de notes (ex. Culture religieuse)
    button.add(@click="$modal.show('add-subject')"): Icon add
    ul.subjects
      li(v-for="subject in all" :key="subject.uuid")
        CardSubject(@click="$modal.show('edit-subject')" v-bind="subject")
    TheBottomBar
      ButtonNormal(variant="text-blue" href="/logout") #[Icon cancel] Annuler
      ButtonNormal.to-right(variant="primary" href="/setup/schedule/settings") Continuer
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ModalAddSubject from '~/components/ModalAddSubject.vue'
import TheBottomBar from '~/components/TheBottomBar.vue'
import CardSubject from '~/components/CardSubject.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import Icon from '~/components/Icon.vue'

export default {
  components: {
    ModalAddSubject,
    CardSubject,
    ButtonNormal,
    Icon,
    TheBottomBar
  },
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
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('subjects/load')
    })
  },
  methods: {
    ...mapActions('subjects', ['post', 'patch'])
  }
}
</script>

<style lang="stylus" scoped>
.container
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
  padding-bottom: 100px

p.help
  text-align: center

h1
  margin-top: 25vh

.add /deep/ i
  font-size: 5em
  padding: 1em

ul.subjects
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  width: 1000px

  @media (max-width: 1000px)
    max-width: 100vw

  li
    margin: 0 auto
    width: 450px // ref: <CardSubject> max-with
    margin-bottom: 1.5em
</style>
