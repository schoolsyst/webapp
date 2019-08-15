export const state = () => ({
    token: '',
    endpoints: {
        obtain: 'http://localhost:8000/api/auth/',
        refresh: 'http://localhost:8000/api/auth/refresh',
        verify: 'http://localhost:8000/api/auth/verify'
    },
    isLoggedIn: false

})

export const getters = {


}

export const mutations = {
    updateToken(state, newToken) {
        localStorage.setItem('token', newToken)
        state.token = newToken
    },
    removeToken(state, newToken) {
        localStorage.removeItem('token')
        state.token = null
    },
    setToken(state, getters) {
        state.token = localStorage.getItem('token') | ''
    },
    setIsLoggedIn(state, value) {
        state.isLoggedIn = value
    }
}

export const actions = {
    init(store) {
        if (process.client) {
            this.commit('auth/setToken')
        }
    },
    obtainToken(store, { username, password }) {
        const payload = { username, password }
        this.$axios.post(store.state.endpoints.obtain, payload)
            .then((res) => {
                this.commit('auth/updateToken', res.data.token)
            })
            .catch((err) => {
                console.log('---JWT obtainToken error---')
                console.log(err)
                console.log('---------------------------')
            })
        this.commit('auth/setIsLoggedIn', true)
    },
    refreshToken(){
        const playload = { token: this.state.token }
        this.$axios.post(store.state.endpoints.refresh, playload)
            .then((res) => {
                this.commit('auth/updateToken', res.data.token)
            })
            .catch((err) => {
                console.log('---JWT refreshToken error---')
                console.log(err)
                console.log('----------------------------')
            })
    },
    inspectToken() {
        const token = this.state.token
        if (token) {
            const decoded = jwt_decode(token)
            const exp = decoded.exp
            const orig_iat = decoded.orig_iat
            console.log(`TOKENINFO exp=${exp} orig_iat=${orig_iat}`)

            // If the token is expiring in 30 mins and not reaching its lifespan (7 days)
            if (exp - (Date.now()/1000) < 1800
            && (Date.now()/1000) - orig_iat < 628200) {
                this.dispatch('auth/refreshToken')
            // If it's expiring in 30mins but the lifespan is not reached
            } else if (exp - (Date.now()/1000) < 1800) {
                // Do nothing.
            } else {
                //TODO: prompt the user to re-login on the next API request
                this.commit('auth/setIsLoggedIn', false)
            }
        } else {
            this.commit('auth/setIsLoggedIn', false)
        }
    }
}
