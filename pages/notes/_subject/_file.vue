<template lang="pug">
//-
  COMPONENT TREE
  Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

  ArrayButtonFlat
  MainGroup
    MainGroupLeft
    MainGroupRight

.container
  MainGroup
    MainGroupLeft
      textarea.editor(v-model="content" :style="{height: '100vh', width: '100%'}")
    MainGroupRight
      .mirror(v-html="$md.render(content)")
</template>

<script>
//--- essentials ---
import axios from 'axios'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
//--- components ---
import TheHeading from '~/components/TheHeading.vue'
import ArrayButtonFlat from '~/components/ArrayButtonFlat.vue'
import ButtonFlat from '~/components/ButtonFlat.vue'
import MainGroup from '~/components/MainGroup.vue'
import MainGroupLeft from '~/components/MainGroupLeft.vue'
import MainGroupRight from '~/components/MainGroupRight.vue'
// //--- MarkdownItVue MUST be imported client-side because it tries to access
// // the window object on import. So I have to use require() instead.

export default {  
    components: {
        TheHeading,
        MainGroup,
        MainGroupLeft,
        MainGroupRight,

    },

    data() {
        return {
          content: '# Vecteurs 3D',
        }
    },

    async mounted() {
      const {data} = await axios.get('http://localhost:8000/api/notes/', {headers:{Authorization: this.$auth.$storage._state['_token.local']}})
      // this.store.commit('SET_NOTES', data)
    },

    computed: {
      ...mapGetters({
        note: 'notes/note'
      })
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>
