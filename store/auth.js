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
  })
}
