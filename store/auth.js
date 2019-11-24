import { getValidator } from "./index";

export const store = () => ({
  username: "",
  loggedIn: false
})

export const getters = {
  validateLogin: getValidator({
    resourceName: { gender: 'M', name: 'compte' },
    fieldNames: {
      username: { gender: 'M', name: "nom d'utilisateur" },
      password: { gender: 'M', name: 'mot de passe' }
    },
    constraints: {
      notEmpty: ['username', 'password'],
      maxLength: {
        300: ['username']
      }
    }
  }),
  validateRegister: getValidator({
    resourceName: { gender: 'M', name: 'compte' },
    fieldNames: {
      username: { gender: 'M', name: "nom d'utilisateur" },
      password: { gender: 'M', name: 'mot de passe'      },
      email:    { gender: 'F', name: 'adresse email'     },
      passwordConfirmation: { gender: 'F', name: 'confirmation du mot de passe'},
    },
    constraints: {
      notEmpty: ['username', 'password', 'email'],
      maxLength: {
        300: ['username', 'email']
      },
      isAnEmail: ['email']
    },
    customConstraints: [
      {
        field: 'passwordConfirmation',
        //FIXME: better error msg
        message: "Les deux mot de passe ne correspondent pas",
        constraint({getters}, object) {
          const pwd1 = object['password']
          const pwd2 = object['passwordConfirmation']
          return pwd1 === pwd2
        }
      }
    ]
  })
}

export const actions = {
  async login({commit}, data) {
    let res = null
    try {
      await this.$auth.loginWith('local', {data})
      this.$router.push('/')
    } catch (e) {
      this.$toast.error(
        "Mot de passe ou non d'utilisateur incorrect",
        {icon: 'error_outline'}
      )
    }
  }
}
