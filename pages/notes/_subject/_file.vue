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
    MainGroupRight(v-if="content")
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

export default {  
    components: {
        TheHeading,
        MainGroup,
        MainGroupLeft,
        MainGroupRight,

    },

    async asyncData({ store, app }) {
      try {
        const { data } = await app.$axios.$get(`/notes/`);
        store.commit("notes/SET_NOTES", data);
      } catch (e) {
        console.error(e);
      }
    },

    computed: {
      content() {
        let { subject, file } = this.$route.params
        let theNote = this.note(subject, file)
        if (theNote !== null) {
          return theNote.content
        } else {
          throw Error(`Note "${subject}/${file}" non trouvée.`)
        }
      },
      ...mapGetters({
        note: 'notes/note'
      })
    },

    data() {
      return {
        notes: []
      }
    },

    mounted() {

    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>
