<template lang="pug">
  .container
    ModalAddGrade.grade(@submit="postGrade($event)")
    ScreenEmpty(@cta="$modal.show('add-grade')")
      template(#smiley) -_-
      p Vous n'avez aucune note.
      template(#cta) Ajouter des notes
</template>

<script>
import ModalAddGrade from '~/components/ModalAddGrade.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import ScreenEmpty from '~/components/ScreenEmpty.vue'
import { mapGetters, mapActions } from 'vuex';
export default {
  components: { ModalAddGrade, ButtonNormal, ScreenEmpty },
  computed: {
    ...mapGetters('grades', ['all'])
  },
  methods: {
    ...mapActions('grades', ['post']),
    async postGrade(grade) {
      const posted = await this.post({grade})
      if (posted) {
        this.$modal.hide('add-grade')
        this.$toast.success('Note ajoutée',
          { icon: 'check', duration: 100000000 }
        )
      } else {
        this.$toast.error("Erreur lors de l'ajout de la note",
          { icon: 'error_outline', duration: 100000000 }
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
</style>
