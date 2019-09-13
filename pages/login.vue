<template lang="pug">

.container
  //-
    .error(v-if="errors") 
      i.material-icons warning
      p Identifiant ou mot de passe erroné

  .centered.login(v-if="loggingIn")
    OverlayLoadingLogo
    form(method="post" @submit.prevent="login")
      .field
          //TODO: remember username
          InputFlat(
              type="username",
              placeholder="Nom",
              name="username",
              icon="account_circle",
              @input="username = $event"
              autofocus, required
          )
          
      .field
          //TODO: toggle 'view password'
          //    HOWTO: new PasswordInputFlat component, based on InputFlat,
          //           that has a toggler between [type=password] & [type=text]
          InputFlat(
              type="password",
              placeholder="Mot de passe",
              name="password",
              icon="lock"
              @input="password = $event"
              required
          )

      ArrayButtonReg.buttons
        ButtonRegPrimary.submit(type="submit") Connexion
      .register-link
        p 
          |Pas de compte ?
          //- FIXME: link is added to DOM but does not redirect. Ctrl+L /register/ Enter works tho.
          span(@click="loggingIn = false") 
            i.material-icons chevron_right
            |Créez-en un
            i.material-icons chevron_left
  .centered.register(v-else)
    TheHeading Créez un compte.
    form(method="post" @submit.prevent="register")
              .field
                  //label(for="field_username") Nom
                  //input#field_username(type="text", name="username")
                  InputFlat(
                      type="text",
                      placeholder="Nom",
                      name="username",
                      icon="account_circle",
                      @input="username = $event"
                  )

              .field
                  //label(for="field_password") Mot de passe
                  //input#field_password(type="password", name="password")
                  InputFlat(
                      type="password",
                      placeholder="Mot de passe",
                      name="password",
                      icon="lock",
                      @input="password = $event"
                  )

              .field
                  //label(for="field_email") Addresse e-mail
                  //input#field_email(type="email", name="email")
                  InputFlat(
                      type="email",
                      placeholder="Addresse e-mail",
                      name="email",
                      icon="email",
                      @input="email = $event"
                  )

              .buttons
                ButtonRegPrimary.submit(type="submit") Créer

              .login-link
                p 
                  |Déjà un compte ?
                  //- FIXME: link is added to DOM but does not redirect. Ctrl+L /register/ Enter works tho.
                  span(@click="loggingIn = true") 
                    i.material-icons chevron_right
                    |Connexion
                    i.material-icons chevron_left
</template>

<script>
import axios from "axios";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import ArrayButtonReg from "~/components/ArrayButtonReg.vue";
import ButtonRegPrimary from "~/components/ButtonRegPrimary.vue";
import InputFlat from "~/components/InputFlat.vue";
import TheHeading from "~/components/TheHeading.vue";
import OverlayLoadingLogo from "~/components/OverlayLoadingLogo.vue";
import ButtonFlat from "~/components/ButtonFlat.vue";
import ButtonRegSecondary from '~/components/ButtonRegSecondary.vue'

export default {
  middleware: false,
  layout: "bare",
  components: {
    ArrayButtonReg,
    ButtonRegPrimary,
    ButtonRegSecondary,
    ButtonFlat,
    InputFlat,
    TheHeading,
    OverlayLoadingLogo
  },

  data() {
    return {
      username: "",
      password: "",
      loggingIn: true,
    };
  },

  methods: {
    async login() {
      try {
        this.$toast.show(`Connexion en cours...`);
        await this.$auth.loginWith("local", {
          data: {
            username: this.username,
            password: this.password
          }
        });
        console.log(this.$auth.loggedIn)
        this.$toast.success(`Connexion réussie. Redirection...`);
      } catch (e) {
        this.$toast.error(`${e}`);
      }
    },
    async register() {
        try {
          this.$toast.show(`Inscription en cours...`);
          await this.$axios.post('/users/', {
            username: this.username,
            email: `${this.username}@gmail.com`,
            password: this.password,
          });
          this.$toast.success(`Inscription réussie.`);
          try {
            this.$toast.show(`Connexion en cours...`);
            await this.$auth.loginWith('local', {
              data: {
                username: this.username,
                password: this.password
              }
            });
            this.$toast.success(`Connexion réussie.`);
          } catch (e) {
            this.$toast.error(`${e}`);
          }
        } catch (e) {
          this.errors = e.response.data;
          if (this.errors.username) {
            // TODO messages d'erreurs de l'API en français
            if (this.errors.username.includes('A user with that username already exists.'))
              this.$toast.error(`Ce nom d'utilisateur existe déjà`)
          } else {
            this.$toast.error(`Inscription ratée.`);
          }
        }
      }
  },
  computed: {},
};
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

+mobile
  .InputFlat
    font-size: 24px
</style>
