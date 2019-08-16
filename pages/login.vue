<template lang="pug">
//-
  COMPONENT TREE
  Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

  ArrayButtonFlat
  MainGroup
    MainGroupLeft
    MainGroupRight

.container
  //-TheHeading(v-if="error") Erreur
  //-TheHeading(v-else) Bienvenue
  .error(v-if="errors") 
    i.material-icons warning
    p Identifiant ou mot de passe erroné

  .centered
    OverlayLoadingLogo
    form(method="post" @submit.prevent="login")
      .field
          //TODO: remember username
          InputFlat(
              type="username",
              placeholder="Nom",
              name="username",
              icon="account_circle",
              autofocus
              @input="username = $event"
          )
          
      .field
          InputFlat(
              type="password",
              placeholder="Mot de passe",
              name="password",
              icon="lock"
              @input="password = $event"
          )

      .buttons
        ButtonRegPrimary.submit(type="submit") Connexion
      .register-link
        p 
          |Pas inscrit ? 
          nuxt-link(to="/register") 
            i.material-icons chevron_right
            |Créer un compte
            i.material-icons chevron_left
</template>

<script>
import axios from 'axios'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import ArrayButtonReg from '~/components/ArrayButtonReg.vue'
import ButtonRegPrimary from '~/components/ButtonRegPrimary.vue'
import InputFlat from '~/components/InputFlat.vue'
import TheHeading from '~/components/TheHeading.vue'
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'
import ButtonFlat from '~/components/ButtonFlat.vue'

export default {
    middleware: 'notAuthed',
    layout: 'bare',
    components: {
      ArrayButtonReg,
      ButtonRegPrimary,
      ButtonFlat,
      InputFlat,
      TheHeading,
      OverlayLoadingLogo
    },

    data() {
        return {
          errors: null
        }
    },

    methods: {
      async login() {
        this.$store.dispatch('auth/obtainToken', {
          username: this.username,
          password: this.password
        })
        .then(() => {
          // this.$cookies
          this.$router.push('/dashboard')
        })
        .catch((err) => {
          this.errors = err
        })
      }
    },
    computed: {
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.centered
    height: 100vh
    width: 100vw
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column

.error
  display: flex
  align-items: center
  z-index: 10
  position: fixed
  background-color: var(--offset-red)
  color: var(--red)
  font-size: 24px
  top: 0
  left: 0
  right: 0
  padding: 15px
  .material-icons
    text-align: center
    display: block
    font-size: 48px
    margin-right: 20px

.TheHeading
  margin-bottom: 70px

.buttons
  margin-top: 30px
  text-align: center

.field
  margin-bottom: 10px

.register-link
  margin-top: 20px
  text-align: center
  font-size: 18px
  i
    position: relative
    bottom: -0.25em
  a:hover
    color: var(--blue)

+mobile
  .InputFlat
    font-size: 24px
</style>
