<template lang="pug">
  .container
    //TODO: For edition of resources, ModalAdd[[resource]] intent="patch" and not intent="post"
    ModalAddGrade.grade(@submit="postGrade($event)" :grade="editingGrade" modal-name="edit-grade")
    ModalAddGrade.grade(@submit="postGrade($event)")
    template(v-if="grades.length > 0" :class="{'show-all': showAllGrades}")
      InputSelectSubject(
        v-model="meansSubject"
        name="means-of" empty-choice="Toutes les matières"
      )
      .left
        HeadingSub
          | {{ showAllGrades ? "Toutes les notes" : "Dernières notes" }}
          ButtonNormal.switch-show-all-grades(variant="text" smaller @click="showAllGrades = !showAllGrades")
            Icon(v-show="showAllGrades") arrow_back
            Icon(v-show="!showAllGrades") arrow_forward
            | {{ showAllGrades ? "Dernières" : "Toutes" }}

        ul.grades
          li.new
            .card-wrapper(@click="$modal.show('add-grade')"): Icon add
          li(
            v-for="grade in grades" :key="grade.uuid"
            @contextmenu.prevent="$refs.menu.open($event, { grade })"
          )
            CardGrade(
              v-bind="grade"
              @edit="$refs.menu.open($event, { grade })"
              @click="editingGrade = grade; $modal.show('edit-grade')"
            )
          li(v-if="all.length > gradesListLimit").more
            ButtonNormal(variant="flat" @click="showAllGrades = true").
              #[Icon more_horiz] Toutes les notes...
      .right
        .means
          HeadingSub Moyennes
        .stats(v-if="all")
          HeadingSub Statistiques
          line-chart(:data="meanOfDays")
    ScreenEmpty(v-else @cta="$modal.show('edit-grade')")
      template(#smiley) -_-
      p Vous n'avez aucune note.
      template(#cta) Ajouter des notes
    vue-context(
      ref="menu"
      :close-on-click="true"
      :close-on-scroll="true"
    )
      template(slot-scope="child" v-if="child.data")
        li: a(@click="editingGrade = child.data.grade; $modal.show('edit-grade')") #[Icon edit] Modifier
        li: a(@click="del(child.data.grade.uuid)") #[Icon delete] Supprimer
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VueContext from 'vue-context'
import 'vue-context/src/sass/vue-context.scss'
import ModalAddGrade from '~/components/ModalAddGrade.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import ScreenEmpty from '~/components/ScreenEmpty.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import InputSelectSubject from '~/components/InputSelectSubject.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import CardGrade from '~/components/CardGrade.vue'
import Icon from '~/components/Icon.vue'
export default {
  components: {
    ModalAddGrade,
    ButtonNormal,
    ScreenEmpty,
    HeadingSub,
    CardGrade,
    VueContext,
    Icon,
    InputSelectSubject,
    BadgeSubject,
  },
  data() {
    return {
      chart: {
        options: {
          xAxes: { display: true },
          yAxes: { display: true },
        },
      },
      editingGrade: null,
      gradesListLimit: 10,
      showAllGrades: false,
      meansSubject: null,
    }
  },
  computed: {
    ...mapGetters('grades', ['all', 'meanOfDays']),
    ...mapGetters({
      subjects: 'subjects/all',
    }),
    grades() {
      let grades = [...this.all]
      if (this.meansSubject)
        grades = grades.filter(o => o.subject.uuid === this.meansSubject.uuid)
      if (!this.showAllGrades) grades = grades.slice(0, this.gradesListLimit)
      return grades
    },
  },
  mounted() {
    this.$withLoadingScreen(
      async () => {
        await this.$store.dispatch('grades/load')
      },
      { title: "Coup d'œil à la pile de contrôles" }
    )
  },
  methods: {
    ...mapActions('grades', ['post', 'delete']),
    async postGrade(grade) {
      const posted = await this.post({ grade })
      if (posted) {
        this.$modal.hide('add-grade')
        this.$toast.success('Note ajoutée', { icon: 'check' })
      } else {
        this.$toast.error("Erreur lors de l'ajout de la note", {
          icon: 'error_outline',
        })
      }
    },
    async del(grade) {
      await this.delete({ uuid: grade.uuid })
    },
  },
}
</script>

<style lang="stylus" scoped>
h2
  margin-bottom 2rem

.grades, .all-grades
  &
    display flex
    flex-wrap wrap

  .card-wrapper:not(.more)
    margin-top 1em
    margin-right 1em
    width 25rem
    height 10rem

.-side-by-side:not(.show-all)
  ul
    display flex
    flex-wrap wrap
    justify-content center
    max-width 90vw
    width 100%

.-side-by-side
  height 100%
  grid-template-columns 1fr

  &.show-all
    @media (min-width: 651px)
      grid-template-columns 2fr 1fr

  .left, .right
    overflow auto

.new .card-wrapper
  display flex
  justify-content center
  align-items center
  border-radius var(--border-radius)
  background var(--blue-offset)
  cursor pointer

  i
    color var(--blue)
    font-size 3rem

  &:hover
    background var(--blue-offset-dark)
    color var(--blue-dark)

.grades .more
  display flex
  justify-content center
</style>
