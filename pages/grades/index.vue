<template lang="pug">
  .container
    ModalAddGrade.grade(@submit="postGrade($event)")
    .-side-by-side(v-if="all")
      .grades
        HeadingSub Notes
        ButtonNormal(@click="$modal.show('add-grade')") Ajouter une note
      .means
        HeadingSub Moyennes
    .stats(v-if="all")
        HeadingSub Statistiques
        line-chart(:data="meanOfDays")
    ScreenEmpty(v-else @cta="$modal.show('add-grade')")
      template(#smiley) -_-
      p Vous n'avez aucune note.
      template(#cta) Ajouter des notes
</template>

<script>
import ModalAddGrade from '~/components/ModalAddGrade.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import ScreenEmpty from '~/components/ScreenEmpty.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import { mapGetters, mapActions } from 'vuex';
export default {
  components: { ModalAddGrade, ButtonNormal, ScreenEmpty, HeadingSub },
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
      }
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
</style>
