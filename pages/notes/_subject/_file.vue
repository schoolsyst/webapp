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
      textarea(v-model="content" :style="{height: '100vh', width: '100%'}")
    MainGroupRight
      no-ssr
        markdown-it-nuxt.md-body(:content="content", :options="options")
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
import 'markdown-it-vue/dist/markdown-it-vue.css'
// import MarkdownItNuxt from 'markdown-it-vue'

export default {  
    components: {
        TheHeading,
        MainGroup,
        MainGroupLeft,
        MainGroupRight,

    },

    data() {
        return {
          title: 'Vecteurs 3D',
          content: '# Vecteurs 3D',
          options: {
            markdownIt: {
              linkify: true
            },
            linkAttributes: {
              target: '_blank',
              rel: 'noopener'
            }
          }
        }
    },

    async mounted() {
      const {data} = await axios.get('http://localhost:8000/api/notes/', {headers:{Authorization: this.$auth.$storage._state['_token.local']}})
      return {
        notes: data
      }
    },

    computed: {
      ...mapGetters({
        
      })
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>
