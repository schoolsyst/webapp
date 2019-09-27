<template lang="pug">
.container
  OverlayLoadingLogo(animation="loop")
  h1 Connexion...
</template>

<script>
//--- essentials ---
import { mapstore, mapGetters, mapMutations, mapActions } from 'vuex'
//--- components ---
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'

export default {
    
    layout: 'bare',
    components: {
      OverlayLoadingLogo
    },

    async fetch({app, store}) {
      console.group('----[ nuxtServerInit (@fetch) ]----')
        let res
        
        try {
            res = await app.$axios.get('/subjects/')
            store.commit('SET_SUBJECTS', res.data)
            console.log(`${res.data.length} subject(s) set.`)

            res = await app.$axios.get('/default-settings/')
            store.commit('SET_DEFAULT_SETTINGS', res.data)
            console.log(`${res.data.length} default-setting(s) set.`)

            res = await app.$axios.get('/settings/')
            store.commit('SET_SETTINGS', res.data)
            console.log(`${res.data.length} setting(s) set.`)

            res = await app.$axios.get("/events/")
            store.commit("schedule/SET_EVENTS", res.data)
            console.log(`${res.data.length} event(s) set.`)

            res = await app.$axios.get("/event-additions/")
            store.commit("schedule/SET_ADDITIONS", res.data)
            console.log(`${res.data.length} event-addition(s) set.`)

            res = await app.$axios.get("/event-deletions/")
            store.commit("schedule/SET_DELETIONS", res.data)
            console.log(`${res.data.length} event-deletion(s) set.`)

            res = await app.$axios.get('/notes/')
            store.commit('notes/SET_NOTES', res.data)
            console.log(`${res.data.length} note(s) set.`)

            
            res = await app.$axios.get('/exercises/')
            store.commit('homework/SET_EXERCISES', res.data)
            console.log(`${res.data.length} exercise(s) set.`)

            res = await app.$axios.get("/tests/")
            store.commit("homework/SET_TESTS", res.data)
            console.log(`${res.data.length} test(s) set.`)
            
            let grades = flatten(res.data.map(test => test.grades))
            store.commit('homework/SET_GRADES', grades)
            console.log(`${grades.length} grade(s) set.`)
        } catch (error) {
            console.error(error)
        }

        console.groupEnd()
    },

    computed: {
      ...mapGetters({
        requireInitialSetup: 'requireInitialSetup'
      })
    },

    mounted() {
      setTimeout(() => {
        if (this.requireInitialSetup) this.$router.push('/setup')
        else this.$router.push('/')
      }, 2000);
      // this.$router.push('/')
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.container
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
</style>
