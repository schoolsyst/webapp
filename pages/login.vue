<template lang="pug">

.container
  OverlayLoadingLogo(animation="animate-in-compound")
  .register-link
    p 
      | Pas de compte ?
      ButtonNormal(small variant="outline" href="/register") Créez-en un
  form(method="post" @submit.prevent="login({username, password}); submitted = true")
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
    InputField,
  },

  data() {
    return {
      username: "",
      password: "",
      email: "",
      error: null,
      submitted: false
    }
  },

  methods: {
    ...mapGetters('auth', ['validateLogin']),
    ...mapActions('auth', ['login']),
  },
  computed: {
    validation() {
      return this.validateLogin()(this)
    },
  },
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
</style>
