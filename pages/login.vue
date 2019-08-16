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
  OverlayLoadingLogo(v-if="!errors")
  code(v-else) {{errors}}
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
      ButtonRegPrimary.submit(type="submit") Valider
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
        }
    },

    methods: {
      async login() {
        try {
          await this.$store.dispatch('auth/obtainToken', {
            username: this.username,
            password: this.password
          })
        } catch (error) {
          this.errors = 'Mauvais'
        }
      }
    },
    computed: {
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.container 
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column

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
