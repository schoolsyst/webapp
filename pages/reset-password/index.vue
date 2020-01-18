<template lang="pug">
  .container
    template(v-if="sent === true")
      img(src="/misc/registered-checkmark.svg")
      h1 Email envoyé !
      p.
        Si vous ne trouvez pas votre mail,
        cherchez avec comme expéditeur "passwords@schoolsyst.com"
      p.
        Comme ce site est tout neuf, 
        il se peut que le mail se retrouve dans vos spams.
      template(v-if="email.endsWith('@gmail.com')")
        ButtonNormal.login(href="https://mail.google.com/" in-place) Ouvrir Gmail
      
    template(v-else-if="sent === false")
      h1 Impossible d'envoyer un mail.
      p Vérifiez votre adresse email
      p Si le problème persiste, veuillez #[a(href="mailto:ewen.lebihan7@gmail.com") me contacter]
    template(v-else)
      h1 Mot de passe oublié ?
      p Demandez à changer votre mot de passe
    template(v-if="!sent")
      form(@submit.prevent="requestPasswordReset")
        InputField(
          :validation="validateEmailAdress({email})"
          name="email" v-model="email" 
          no-error-messages no-label no-action-button
          placeholder="Addresse email"
        )
        ButtonNormal(
          :validation="validateEmailAdress({email})"
          variant="outline"
          type="submit"
        ) Envoyer
    p.go-back(v-if="!sent"): nuxt-link(to="/") Retour
</template>

<script>
import InputField from '~/components/InputField.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { InputField, ButtonNormal },
  auth: 'guest',
  layout: 'bare',
  data() {
    return { email: null, sent: null}
  },
  computed: mapGetters('auth', ['validateEmailAdress']),
  methods: {
    ...mapActions('auth', {_requestPasswordReset: 'requestPasswordReset'}),
    async requestPasswordReset() {
      this.sent = await this._requestPasswordReset({email: this.email})
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  display flex
  justify-content center
  align-items center
  flex-direction column
  text-align center
  form
    margin-top 3em
    display flex
    align-items center
    justify-content center
    flex-wrap wrap
    .field
      width 80vw
      max-width 400px
    .button /deep/ .btn
      margin-top 1em
    @media (min-width 651px)
      .button /deep/ .btn
        margin: 0
      .button /deep/ .btn
        border-top-left-radius 0
        border-bottom-left-radius 0
        border-left none
      .field /deep/ input
        border-top-right-radius 0
        border-bottom-right-radius 0
  .go-back
    margin-top: 3em
  .login
    margin-top: 1.5em
</style>
