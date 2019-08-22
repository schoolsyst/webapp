<template lang="pug">
//-
  COMPONENT TREE
  Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

  ArrayButtonFlat
  MainGroup
    MainGroupLeft
    MainGroupRight
  //TODO: synchronized scrolling

.container
  BarFloating
    ButtonIcon(@click="save_render" title="Télécharger le rendu (.pdf)") file_copy
    //TODO: Ripple effect when @click on sync btn
    ButtonIcon(@click="sync"        title="Synchroniser") import_export
    ButtonIcon(@click="save_source" title="Télécharger la source (.md)") archive
  MainGroup
    MainGroupLeft
      //TODO: Keyboard shortcut Ctrl-S to sync()
      //@keyup.control.s.prevent="sync"
      textarea.editor(v-model="content") 
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
import ButtonIcon from '~/components/ButtonIcon.vue'
import BarFloating from '~/components/BarFloating.vue'
import moment from 'moment';

export default {  
    components: {
        TheHeading,
        MainGroup,
        MainGroupLeft,
        MainGroupRight,
        BarFloating,
        ButtonIcon
    },

    async asyncData({ store, app, route }) {
      let error = false
      try {
        const { data } = await app.$axios.get(`/notes/`);
        store.commit("notes/SET_NOTES", data);
      } catch (e) {
        console.error(e);
      }

      if (!store.getters.allSettings.length) {
        try {
          const { data } = await app.$axios.get('/settings/')
          store.commit('SET_SETTINGS', data)
        } catch (e) {
          console.error(e)
        }
      }

      try {
        let { uuid } = route.params
        const { data } = await app.$axios.get(`/notes/${uuid}/`)
        return {
          name: data.name,
          subject: data.subject,
          created: data.created,
          server_last_modified: data.last_modified,
          server_content: data.content,
          uuid: data.uuid
        }
      } catch (e) {
        if (e.response.status == 404) {
          error = "Note non trouvée."
          return {
            error
          }
          // app.$router.push('/notes')
        }
      }
    },

    data() {
      return {
        content: 'Chargement...'
      }
    },

    mounted() {
      let content
      let local = {
        content: window.localStorage.getItem(`${this.uuid}--noteContent`),
        modified: moment(window.localStorage.getItem(`${this.uuid}--noteLastModified`)),
      }
      let server = {
        content: this.server_content,
        modified: moment(this.server_last_modified)
      }
      if (local.modified.isAfter(server.modified)) {
        this.content = local.content
        this.$toast.show('La note enregistrée ici est plus récente que celle du serveur, et a été restaurée.')
        this.uploadToServer(moment().format(), local.content)

      } else {
        this.content = server.content
      }
    },

    watch: {
      content(newContent, oldContent) {
        window.localStorage.setItem(`${this.uuid}--noteContent`, newContent)
        window.localStorage.setItem(`${this.uuid}--noteLastModified`, moment().format())
        this.content = newContent
      }
    },

    computed: {
      ...mapGetters({
        note: 'notes/note'
      })
    },

    methods: {
      async uploadToServer(last_modified, content) {
        let errored = false
        try {
          const { data } = await this.$axios.patch(`/notes/${this.uuid}/`, {last_modified, content})
          this.$toast.success('Synchronisation réussie')
        } catch (e) {
          errored = true
          this.$toast.error(`Erreur lors de la synchronisation: ${e}`)
        }
        if (!errored) {
          window.localStorage.removeItem(`${this.uuid}--noteContent`)
          window.localStorage.removeItem(`${this.uuid}--noteLastModified`)
        }
      },
      sync() {
        this.uploadToServer(moment().format(), this.content)
      },
      save_source() {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.content));
        element.setAttribute('download', this.name);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

textarea
  height: 100%
  width: 100%
  font-family: 'Roboto Mono', monospace
  font-size: 18px
.MainGroup [class^=MainGroup]
  height: 100vh
.mirror
  overflow-y: scroll
  line-height: 1.3
  font-size: 24px
  *
    word-break: everywhere
</style>
