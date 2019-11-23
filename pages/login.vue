<template lang="pug">

.container
  //-
    .error(v-if="errors") 
      i.material-icons warning
      p Identifiant ou mot de passe erroné
  //- .logging-in(v-show="loading")
  //-   OverlayLoadingLogo(animation="loop")
  //-   h1 Connexion...

  .centered.login(v-if="loggingIn")
    OverlayLoadingLogo(animation="animate-in")
    .register-link
      p 
        | Pas de compte ?
        ButtonNormal(small variant="outline" @click="loggingIn = false") Créez-en un
    form(method="post" @submit.prevent="login")
      //TODO: remember username
      InputField(name="username" v-model="username" :validation="loginValidation") Nom
      InputField(type="password" v-model="password" :validation="loginValidation") Mot de passe
      .forgotten-password
        p 
          | Mot de passe oublié ? 
          nuxt-link(to="/reset-password/") Changez-le ici
          |.
      ButtonNormal(
        variant="primary"
        type="submit"
        :validation="loginValidation"
      ).submit Connexion
      
  .centered.register(v-else)
    TheHeading Créez un compte.
    form(method="post" @submit.prevent="register")
      .login-link
        p 
          | Déjà un compte ?
          ButtonNormal(small variant="outline" @click="loggingIn = true") Connectez-vous.
      InputField(name="username" v-model="username") Nom
      InputField(type="email"    v-model="email") Email
      InputField(type="password" v-model="password") Mot de passe
</template>

<script>
import axios from "axios"
import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
import TheHeading from "~/components/TheHeading.vue"
import OverlayLoadingLogo from "~/components/OverlayLoadingLogo.vue"
import ButtonNormal from '~/components/ButtonNormal.vue'
import InputField from '~/components/InputField.vue'

export default {
  middleware: false,
  layout: "bare",
  components: {
    TheHeading,
    OverlayLoadingLogo,
    ButtonNormal,
    InputField
  },

  data() {
    return {
      username: "",
      password: "",
      loggingIn: true,
      loading: false,
    }
  },

  methods: {
    ...mapGetters('auth', ['validateLogin']),
    async login() {
      let res = null
      try {
        // console.log("heeeeey")
        this.loading = true
        this.$toast.show(`Connexion en cours...`)
        await this.$auth.loginWith("local", {
          data: {
            username: this.username,
            password: this.password,
          },
        })
        this.$router.push("logged-in/")
        this.$toast.success(`Connexion réussie. Redirection...`)
      } catch (e) {
        this.$toast.error(`Mot de passe ou non d'utilisateur incorrect`)
      }
    },
    async register() {
      try {
        this.$toast.show(`Inscription en cours...`)
        if (!this.username || !this.email || !this.password) {
          this.$toast.error(
            "Tout les champs sont obligatoires: veuillez les compléter."
          )
          return
        }
        await this.$axios.post("/users/", {
          username: this.username,
          email: this.email,
          password: this.password,
        })
        this.$toast.success(`Inscription réussie.`)
        try {
          await this.$auth.loginWith("local", {
            data: {
              username: this.username,
              password: this.password,
            },
          })
          this.$router.push("/setup")
        } catch (e) {
          this.$toast.error(`${e}`)
        }
      } catch (e) {
        this.errors = e.response.data
        if (this.errors.username) {
          // TODO messages d'erreurs de l'API en français
          if (
            this.errors.username.includes(
              "A user with that username already exists."
            )
          )
            this.$toast.error(`Ce nom d'utilisateur existe déjà`)
        } else {
          this.$toast.error(`Inscription ratée.`)
        }
      }
    },
  },
  computed: {
    loginValidation() {
      return this.validateLogin()({
        username: this.username, 
        password: this.password
      })
    }
  },
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
  text-align: center

// UNUSED
/* .error
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
    margin-right: 20px */

.TheHeading
  margin-bottom: 70px

.buttons
  margin-top: 30px
  text-align: center

.field
  margin-bottom: 30px

.register-link, .login-link
  margin-top: 20px
  text-align: center
  font-size: 18px
  i
    position: relative
    bottom: -0.25em
  span:hover
    cursor: pointer
    color: var(--blue)
.register-link
  margin-bottom: 30px

+mobile
  .InputFlat
    font-size: 24px

.logging-in
  height: 100vh
  width: 100vw
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
</style>
