<template lang="pug">
  .container(:class="{registered}")
    OverlayLoadingLogo.logo(animation="animate-in-compound")
    template(v-if="!registered")
      .login-link
        p
          | Déjà un compte ?
          ButtonNormal(small variant="outline" href="/login") Connectez-vous
      form(method="post" @submit.prevent="registered = register({username, password})")
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
          ButtonNormal.submit(variant="primary" v-bind="{validation}") Créez votre compte
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
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'
import InputField from '~/components/InputField.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  layout: 'bare',
  auth: 'guest', // Disable auth requirements
  components: { OverlayLoadingLogo, InputField, ButtonNormal },
  data() {
    return {
      username: "ewen-le-bihan",
      email: "",
      password: "",
      passwordConfirmation: "",
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
    ...mapActions('auth', ['register'])
  }
}
</script>

<style lang="stylus" scoped>
.container
  min-height 100vh
  min-width 100vw
  display flex
  justify-content center
  align-items center
  flex-direction column
  text-align: center
@media (min-width: calc(888px + 1px))
  form
    display grid
    grid-template-columns repeat(2, 1fr)
    grid-gap 2em
  .group-both
    grid-column 1 / span 2
    width 100%
    display flex
    justify-content center

.login-link
  margin-bottom: 4em
.forgotten-password
  margin-top: 2em
.submit
  margin-top: 1em

.field
  width: 300px


.registered
  display flex
  align-items center
  @media (max-width 888px)
    flex-direction column
    justify-content center
    img
      width 90vw
  p
    font-size 1.5rem
    line-height 1.2em
  .text
    text-align left
    @media (max-width 888px)
      text-align: center
    max-width 20em
    & /deep/ .btn
      margin-top 2em

@media (max-width 888px)
  .registered .logo
    display: none
</style>
