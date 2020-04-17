<template lang="pug">
.container
  OverlayLoadingLogo(animation="animate-in-compound")
  p.explain
    span.-mobile-only schoolsyst: 
    | Une application web tout-en-un pour gérer notes, devoirs, emploi du temps et bien plus encore. 
    wbr
    a(href="https://schoolsyst.com/") En savoir plus
  .register-link
    p 
      | Pas de compte ?
      ButtonNormal(smaller variant="outline" href="/register") Créez-en un
  form(method="post" @submit.prevent="login({username, password}); submitted = true")
    //TODO: social login
    //TODO: remember username
    InputField(
      name="username"
      v-model="username"
      v-bind="{validation}"
      tabindex="0"
      no-action-button
    ) Nom
    InputField(
      type="password"
      v-model="password"
      v-bind="{validation}"
    ) Mot de passe

    .forgotten-password
      p 
        | Mot de passe oublié ? 
        nuxt-link(to="/reset-password/") Changez-le ici
        |.
    ButtonNormal(
      variant="primary"
      type="submit"
      v-bind="{validation}"
    ).submit Connexion
  TheFooter
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TheHeading from '~/components/TheHeading.vue'
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import InputField from '~/components/InputField.vue'

export default {
  middleware: false,
  layout: 'bare',
  components: {
    TheHeading,
    OverlayLoadingLogo,
    ButtonNormal,
    InputField
  },

  data() {
    return {
      username: '',
      password: '',
      email: '',
      error: null,
      submitted: false
    }
  },
  computed: {
    validation() {
      return this.validateLogin()(this)
    }
  },
  methods: {
    ...mapGetters('auth', ['validateLogin']),
    ...mapActions('auth', ['login'])
  }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.container
  height: 100vh
  width: 100vw
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  text-align: center

.register-link
  margin-bottom: 4em
.forgotten-password
  margin-top: 0em
.submit
  margin-top: 3em
.explain
  margin-top: -1em
  margin-bottom: 3em
  max-width: 700px

@media (min-width: 500px)
  .explain .-mobile-only
    display: none
</style>
