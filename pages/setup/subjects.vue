<template lang="pug">
  .container
    // TODO(beta-1.1.0): modal anchored in page, no need to click a btn
    ModalAddSubject(
      v-model="newSubject"
      @submit="post({subject: newSubject}); newSubject = defaults"
      action="add"
    )
    ModalAddSubject(
      v-model="editingSubject"
      @submit="patch({modifications: editingSubject, uuid: editingSubject.uuid})"
      @delete="del({uuid: editingSubject.uuid})"
      action="edit"
    )
    .-side-by-side
      .left
        h1 Ajoutez vos matières.
        p.help Ajoutez toutes les matières qui sont dans votre emploi du temps,#[br]même celles dans lesquelles vous n'aurez pas de notes
        button.add(@click="$modal.show('add-subject')"): Icon add
      .right
        ul.subjects
          li(v-for="subject in all" :key="subject.uuid")
            CardSubject(@click="editingSubject = subject; $modal.show('edit-subject')" v-bind="subject")
    TheBottomBar
      ButtonNormal(variant="text-blue" href="/logout") #[Icon cancel] Annuler
      ButtonNormal.to-right(
        variant="primary"
        href="/setup/schedule/settings"
        :disabled="all.length === 0"
        v-tooltip="all.length === 0 ? 'Veuillez ajouter vos matières' : ''"
      ) Continuer
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ModalAddSubject from '~/components/legacy/ModalAddSubject.vue'
import TheBottomBar from '~/components/legacy/TheBottomBar.vue'
import CardSubject from '~/components/legacy/CardSubject.vue'
import ButtonNormal from '~/components/legacy/ButtonNormal.vue'
import Icon from '~/components/legacy/Icon.vue'

export default {
  components: {
    ModalAddSubject,
    CardSubject,
    ButtonNormal,
    Icon,
    TheBottomBar,
  },
  layout: 'bare',
  data() {
    const defaults = {
      color: '#000000',
      name: null,
      weight: null,
      goal: null,
    }
    return {
      defaults,
      newSubject: defaults,
      editingSubject: {
        ...defaults,
        uuid: null,
      },
    }
  },
  computed: {
    ...mapGetters('subjects', ['all']),
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('subjects/load')
    })
  },
  methods: {
    ...mapActions('subjects', ['post', 'patch']),
    ...mapActions('subjects', { del: 'delete' }),
  },
}
</script>

<style lang="stylus" scoped>
.container
  display flex
  flex-direction column
  justify-content center
  align-items center
  padding-bottom 100px

@media (max-width: 650px)
  .left
    text-align center

  h1
    margin-top 25vh

p.help, h1
  margin 0 10px

.add /deep/ i
  padding 1em
  font-size 5em

ul.subjects
  display flex
  flex-direction column
  justify-content center
  align-items center
  width 100%

  @media (max-width: 1000px)
    max-width calc(100vw - (2 * 10px)) //ref: layout .container padding

  li
    margin 0 auto
    margin-bottom 1.5em
    max-width calc(100vw - (2 * 10px)) //ref: layout .container padding
    width 450px //ref: <CardSubject> max-with
</style>
