<template lang="pug">
  .container
    //TODO: For edition of resources, <ModalAdd[[resource]] intent="patch"> and not intent="post"
    ModalAddGrade.grade(@submit="postGrade($event)")
    .-side-by-side(v-if="all")
      .left
        HeadingSub Notes
          ButtonNormal(@click="$modal.show('add-grade')" small) Ajouter
        ul.grades
          li(
            v-for="grade in all" :key="grade.uuid"
            @contextmenu.prevent="$refs.menu.open($event, { grade })"
          )
            CardGrade(v-bind="grade" @edit="$refs.menu.open($event, { grade })")
      .right
        .means
          HeadingSub Moyennes
        .stats(v-if="all")
          HeadingSub Statistiques
          line-chart(:data="meanOfDays")
    ScreenEmpty(v-else @cta="$modal.show('add-grade')")
      template(#smiley) -_-
      p Vous n'avez aucune note.
      template(#cta) Ajouter des notes
    vue-context(
      ref="menu" 
      :close-on-click="true" 
      :close-on-scroll="true"
    )
      template(slot-scope="child" v-if="child.data")
        li: a(@click="editingItem = child.grade.data; $modal.show('edit-grade')") #[Icon edit] Modifier
        li: a(@click="del(child.data.grade.uuid)") #[Icon delete] Supprimer
</template>

<script>
import ModalAddGrade from '~/components/ModalAddGrade.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import ScreenEmpty from '~/components/ScreenEmpty.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import CardGrade from '~/components/CardGrade.vue'
import Icon from '~/components/Icon.vue'
import { mapGetters, mapActions } from 'vuex';
import VueContext from 'vue-context'
import 'vue-context/src/sass/vue-context.scss'
export default {
  components: { ModalAddGrade, ButtonNormal, ScreenEmpty, HeadingSub, CardGrade, VueContext, Icon },
  data() {
    return {
      chart: {
        options: {
          xAxes: {
            display: true
          },
          yAxes: {
            display: true
          }
        }
      },
      editingItem: null
    }
  },
  computed: {
    ...mapGetters('grades', ['all', 'meanOfDays'])
  },
  methods: {
    ...mapActions('grades', ['post']),
    async postGrade(grade) {
      const posted = await this.post({grade})
      if (posted) {
        this.$modal.hide('add-grade')
        this.$toast.success('Note ajoutée',
          { icon: 'check' }
        )
      } else {
        this.$toast.error("Erreur lors de l'ajout de la note",
          { icon: 'error_outline' }
        )
      }
    },
  },
  async mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('grades/load')
    }, { title: "Coup d'œil à la pile de contrôles" })
  },
}
</script>

<style lang="stylus" scoped>
h2
  margin-bottom 2rem
.grades li
  margin-top 1em
.-side-by-side
  height 100%
  // grid-template-columns 1fr 2fr
  .left, .right
    overflow auto

</style>
