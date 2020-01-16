<template lang="pug">
  .container
    h1 Vos rapports
    ButtonNormal(variant="primary" href="/reports/new") Nouveau
    //TODO: list reports, redir to new/ if no reports
</template>

<script>
import ButtonNormal from '~/components/ButtonNormal.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  components: { ButtonNormal },
  layout: 'bare',
  computed: {
    ...mapGetters('reports', ['all'])
  },
  mounted() {
    if (!this.all.length) this.$router.replace('/reports/new')
  }
}
</script>

<style lang="stylus" scoped>
.container
  display flex
  justify-content center
  align-items center
  flex-direction column
h1
  margin-bottom 2em
</style>
