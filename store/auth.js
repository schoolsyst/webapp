import { getValidator } from './index'

export const store = () => ({
  username: '',
  loggedIn: false
})

// TODO: passwordStrengthConstraint using https://www.npmjs.com/package/password-validator

const passwordConfirmationConstraint = {
  field: 'passwordConfirmation',
  message: 'Les deux mot de passe ne correspondent pas',
  constraint(_, object) {
    const pwd1 = object.password
    const pwd2 = object.passwordConfirmation
    return pwd1 === pwd2
  }
}

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
      email: { gender: 'F', name: 'adresse email' },
      password: { gender: 'M', name: 'mot de passe' },
      passwordConfirmation: {
        gender: 'F',
        name: 'confirmation du mot de passe'
      }
    },
    constraints: {
      notEmpty: ['username', 'password', 'email'],
      maxLength: {
        300: ['username', 'email']
      },
      isAnEmail: ['email']
    },
    customConstraints: [passwordConfirmationConstraint]
  }),
  validatePasswordReset: getValidator({
    resourceName: { gender: 'M', name: 'mot de passe' },
    fieldNames: {
      password: { gender: 'M', name: 'mot de passe' },
      passwordConfirmation: {
        gender: 'F',
        name: 'confirmation du mot de passe'
      },
      email: { gender: 'F', name: 'adresse email' }
    },
    constraints: {
      required: ['password'],
      isAnEmail: ['email'],
      maxLength: {
        300: ['email']
      }
    },
    customConstraints: [passwordConfirmationConstraint],
    debug: true
  }),
  validateEmailAdress: getValidator({
    resourceName: { gender: 'M', name: 'addresse email' },
    fieldNames: {
      email: { gender: 'F', name: 'adresse email' }
    },
    constraints: {
      required: ['email'],
      isAnEmail: ['email']
    }
  })
}

export const actions = {
  async login({ commit }, data) {
    try {
      await this.$auth.loginWith('local', { data })
      this.$router.push('/')
    } catch (e) {
      if (
        e.response.data.non_field_errors &&
        e.response.data.non_field_errors[0] ===
          'Unable to log in with provided credentials.'
      ) {
        this.$toast.error("Mot de passe ou nom d'utilisateur incorrect", {
          icon: 'error_outline'
        })
        return false
      }
      this.$toast.error('Erreur interne, veuillez réessayer plus tard.', {
        icon: 'error_outline'
      })
    }
  },
  async register({ dispatch, getters }, data) {
    try {
      await this.$axios.post('/users/', data)
      return true
    } catch (error) {
      const data = error.response.data
      if (
        data.email &&
        data.email[0] === 'user with this email already exists.'
      ) {
        this.$toast.error('Cette adresse e-mail est déjà prise', {
          icon: 'error_outline'
        })
      } else if (
        data.username &&
        data.username[0] === 'A user with that username already exists.'
      ) {
        this.$toast.error("Ce nom d'utilisateur est déjà pris", {
          icon: 'error_outline'
        })
      } else {
        this.$toast.error('Erreur lors de la création du compte', {
          icon: 'error_outline'
        })
      }
      return false
    }
  },
  async requestPasswordReset(_, data) {
    try {
      const res = await this.$axios.post('/password-reset/', data)
      return res.data.status === 'OK'
    } catch (error) {
      return false
    }
  },
  async changePassword(_, data) {
    try {
      const res = await this.$axios.post('/password-reset/confirm/', data)
      return res.data.status === 'OK'
    } catch (error) {
      return false
    }
  }
}
