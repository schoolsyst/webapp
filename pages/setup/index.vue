<template lang="pug">
  .container
    h1 Vous n'avez plus qu'à configurer votre compte.
    p.
      Une saisie de quelques informations s'impose. On ne vous demandera ça qu'une seule fois.
    p.
      Cette configuration vous permet, entre autres, de rentrer vos matières et votre emploi du temps.
    ButtonNormal.start(variant="primary" href="/setup/subjects") Démarrer
</template>

<script>
import ButtonNormal from '~/components/legacy/ButtonNormal.vue'

export default {
  components: { ButtonNormal },
  layout: 'bare',
}
</script>

<style lang="stylus" scoped>
.container
  display flex
  flex-direction column
  justify-content center
  align-items center
  text-align center

  p
    max-width 1000px

  .start
    margin-top 2em
</style>
