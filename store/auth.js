import axios from 'axios'

export const state = () => ({
  token: "",
  endpoints: {
    obtain: "http://localhost:8000/api/auth/",
    refresh: "http://localhost:8000/api/auth/refresh",
    verify: "http://localhost:8000/api/auth/verify"
  },
});

export const getters = {
  token(state, getters) {
    return state.token
  },
}

export const mutations = {
  UPDATE_TOKEN(state, newToken) {
    localStorage.setItem("token", newToken);
    state.token = newToken;
  },
  REMOVE_TOKEN(state, newToken) {
    localStorage.removeItem("token");
    state.token = null;
  },
  SET_TOKEN: (state, getters) => (token) => {
    state.token = token
  },
};

export const actions = {
  obtainToken: async (store, { username, password }) => {
    try {
      const {data} = await axios.post('http://localhost:8000/api/auth/', {username, password})
      this.commit('SET_TOKEN', data.token)
    } catch (error) {
      throw new Error('Wrong credentials')
    }
  },

  refreshToken() {
    const playload = { token: this.state.token };
    this.$axios
      .post(store.state.endpoints.refresh, playload)
      .then(res => {
        this.commit("auth/UPDATE_TOKEN", res.data.token);
      })
      .catch(err => {
        console.log("---JWT refreshToken error---");
        console.log(err);
        console.log("----------------------------");
      });
  },
  inspectToken() {
    const token = this.state.token;
    if (token) {
      const decoded = jwt_decode(token);
      const exp = decoded.exp;
      const orig_iat = decoded.orig_iat;
      console.log(`TOKENINFO exp=${exp} orig_iat=${orig_iat}`);

      // If the token is expiring in 30 mins and not reaching its lifespan (7 days)
      if (
        exp - Date.now() / 1000 < 1800 &&
        Date.now() / 1000 - orig_iat < 628200
      ) {
        this.dispatch("auth/refreshToken");
        // If it's expiring in 30mins but the lifespan is not reached
      } else if (exp - Date.now() / 1000 < 1800) {
        // Do nothing.
      } else {
        //TODO: prompt the user to re-login on the next API request
        this.commit("auth/token", "");
      }
    } else {
      this.commit("auth/token", "");
    }
  },
  setToken(store, token) {
    this.commit('auth/SET_TOKEN', token)
    this.$cookie.set('token', token, {
      path: '/',
      maxAge: 60*60*24*7
    })
  },
};
