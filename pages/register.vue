<template lang="pug">
    .container
        TheHeading Créez un compte.

        .login-error(v-if="error") {{error}}

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

            ButtonRegPrimary.submit(type="submit") Valider
</template>

<script>
import axios from 'axios'
import ArrayButtonReg from '~/components/ArrayButtonReg.vue'
import ButtonRegPrimary from '~/components/ButtonRegPrimary.vue'
import ButtonRegSecondary from '~/components/ButtonRegSecondary.vue'
import InputFlat from '~/components/InputFlat.vue'
import TheHeading from '~/components/TheHeading.vue'

export default {
    layout: 'bare',
    components: {
        ArrayButtonReg,
        ButtonRegPrimary,
        ButtonRegSecondary,
        InputFlat,
        TheHeading
    },

    data() {
    return {
      username: '',
      email: '',
      password: '',
      error: null
    }},

  methods: {
    async register() {
      const {data} = await axios.post('http://localhost:8000/api/users/', {
        username: this.username, 
        email: this.email, 
        password: this.password
      })
      this.$router.push('/')
    }
  },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.container 
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column

.submit
    margin-top: 30px

.InputFlat
    margin-bottom: 10px
    +mobile
        font-size: 24px

.TheHeading
    text-align: center
    +desktop
        margin-bottom: 50px
    +mobile
        margin-bottom: 20px

form
    display: flex
    flex-direction: column
    align-items: center
    +phone
        &, .field
        width: 90vw
    
</style>