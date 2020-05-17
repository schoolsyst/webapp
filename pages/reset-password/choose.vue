<template lang="pug">
.container
  template(v-if="changed === true")
    img(src="/misc/checkmark.svg")
    h1 Votre mot de passe a été changé
    p Vous n'avez plus qu'à vous re-connecter avec votre tout nouveau mot de passe!
    ButtonNormal(variant="outline" href="/login") Se connecter
  template(v-else-if="changed === false")
    h1 Erreur lors de la modification du mot de passe.
    p Il se peut que le lien soit expiré. Essayez de #[nuxt-link(to="/reset-password") refaire une demande].
  template(v-else)
    h1 Choisissez votre nouveau mot de passe
    form(@submit.prevent="changePassword")
      InputField(
        v-if="!email"
        v-model="email"
        v-bind="{validation}"
      ) Adresse e-mail
      InputField(
        type="password"
        v-model="password"
        v-bind="{validation}"
      ) Votre nouveau mot de passe
      InputField(
        type="password"
        name="password-confirmation"
        v-model="passwordConfirmation"
        v-bind="{validation}"
      ) Confirmez-le
      ButtonNormal(
        variant="primary"
        v-bind="{validation}"
        type="submit"
      ) Changer
  p.go-back(v-if="!changed"): nuxt-link(to="/") Retour
  p.token Token:&nbsp; #[code {{$route.query.token}}] #[Icon(v-tooltip="`Utilisez-le quand vous souhaitez obtenir de l'aide`") help_outline]
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Icon from '~/components/legacy/Icon.vue'
import ButtonNormal from '~/components/legacy/ButtonNormal.vue'
import InputField from '~/components/legacy/InputField.vue'

export default {
  components: { ButtonNormal, InputField, Icon },
  auth: 'guest',
  layout: 'bare',
  data() {
    return {
      success: null,
      password: null,
      passwordConfirmation: null,
      mEmail: null,
      changed: null,
    }
  },
  computed: {
    email: {
      get() {
        return this.mEmail || this.$route.query.email || null
      },
      set(email) {
        this.mEmail = email
      },
    },
    validation() {
      return this.validatePasswordReset()({
        email: this.email,
        password: this.password,
        passwordConfirmation: this.passwordConfirmation,
      })
    },
  },
  methods: {
    ...mapGetters('auth', ['validatePasswordReset']),
    ...mapActions('auth', { _changePassword: 'changePassword' }),
    async changePassword() {
      this.changed = await this._changePassword({
        password: this.password,
        token: this.$route.query.token,
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.container
  display flex
  flex-direction column
  justify-content center
  align-items center
  text-align center

  form
    margin-top 3em

  .field
    max-width 400px
    width 80vw

  .button
    margin-top 2em

  .go-back
    margin-top 1em

  .token
    display flex
    align-items center
    margin-top 5em
    color var(--grey-dark)
    font-size 1em

    i
      margin-left 0.25em
      color var(--grey)
      font-size 1.3em
      cursor pointer
</style>
