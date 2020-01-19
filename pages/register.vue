<template lang="pug">
  .container(:class="{registered}")
    //TODO: "email already taken" / "username already taken" / "password too weak" cases
    OverlayLoadingLogo.logo(animation="animate-in-compound")
    template(v-if="!registered")
      .login-link
        p
          | Déjà un compte ?
          ButtonNormal(smaller variant="outline" href="/login") Connectez-vous
      form(method="post" @submit.prevent="register")
        .group-left
          InputField(
            name="username"
            v-model="username"
            v-bind="{validation}"
            tabindex="1"
          ) Nom d'utilisateur
          InputField(
            name="email"
            v-model="email"
            v-bind="{validation}"
            tabindex="2"
          ) Adresse email
        .group-right
          InputField(
            type="password"
            v-model="password"
            v-bind="{validation}"
            tabindex="3"
          ) Mot de passe
          InputField(
            type="password"
            name="password-confirmation"
            v-model="passwordConfirmation"
            v-bind="{validation}"
            tabindex="4"
          ) Confirmer le mot de passe
        .group-both
          ButtonNormal.submit(variant="primary" v-bind="{validation}" type="submit") Créez votre compte
    template(v-else)
      .registered
        img(src="/misc/registered-checkmark.svg")
        .text 
          p 
            | Vous voici fin prêt, 
            wbr
            span.username {{ username }}
            |.
          ButtonNormal.cta(href="/login" variant="primary") Connectez-vous

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'
import InputField from '~/components/InputField.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'

export default {
  layout: 'bare',
  auth: 'guest', // Disable auth requirements
  components: { OverlayLoadingLogo, InputField, ButtonNormal },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      registered: false
    }
  },
  computed: {
    validation() {
      return this.validateRegister()(this)
    }
  },
  methods: {
    ...mapGetters('auth', ['validateRegister']),
    ...mapActions('auth', { _register: 'register' }),
    async register() {
      this.registered = await this._register({
        email: this.email,
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  min-height: 100vh
  min-width: 100vw
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
  text-align: center

@media (min-width: calc(888px + 1px))
  form
    display: grid
    grid-template-columns: repeat(2, 1fr)
    grid-gap: 2em

  .group-both
    grid-column: 1 / span 2
    width: 100%
    display: flex
    justify-content: center

.login-link
  margin-bottom: 4em

.forgotten-password
  margin-top: 2em

.submit
  margin-top: 1em

.field
  width: 300px

.registered
  display: flex
  align-items: center

  @media (max-width: 888px)
    flex-direction: column
    justify-content: center

    img
      width: 90vw

  p
    font-size: 1.5rem
    line-height: 1.2em

  .text
    text-align: left

    @media (max-width: 888px)
      text-align: center

    max-width: 20em

    & /deep/ .btn
      margin-top: 2em

@media (max-width: 888px)
  .registered .logo
    display: none
</style>
