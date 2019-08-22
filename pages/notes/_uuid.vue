<template lang="pug">
//-
  COMPONENT TREE
  Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

  ArrayButtonFlat
  MainGroup
    MainGroupLeft
    MainGroupRight
  //TODO: synchronized scrolling
  //TODO: button to upload source file to textarea
  //TODO: Jump to section
  //TODO: Search-and-replace
  //TODO: save scroll pos

.container
  TheNavbar(slide-out).slid-out
  BarFloating
    ButtonIcon(@click="save_source" title="Télécharger la source (.md)") archive
    //TODO: Ripple effect when @click on sync btn
    ButtonIcon(@click="sync"        title="Synchroniser") import_export
    ButtonIcon(@click="save_render" title="Télécharger le rendu (.pdf)") file_copy
  MainGroup
    MainGroupLeft
      textarea#editor(v-model="content") 
    MainGroupRight(v-if="content")
      #mirror(v-html="$md.render(content)")
  style.
    h2 {
      margin-top: 20px;
      margin-bottom: 5px;
      font-weight: 500;
      font-size: 45px;
    }
    h1 {
      font-family: 'Google Sans', 'Product Sans';
      font-weight: lighter;
      font-size: 70px;
    }
    h3 {
      margin-top: 10px;
      margin-bottom: 5px;
      font-size: 30px;
      font-weight: normal;
    }
    p {
      line-height: 1.3;
      margin: 10px 0;
    }
    code {
      color: var(--blue);
    }
    .footnotes-sep {
      opacity: .75
      margin-top: 10px
    }
    .admonition {
      background: var(--offset-blue);
      border-radius: 10px;
      padding: 10px 20px;
      margin: 20px 0;
    }
    .admonition-title {
      color: var(--blue);
      font-size: 24px;
      font-weight: bold
    }
    .admonition.failure,
    .admonition.danger,
    .admonition.bug {
      background: var(--red)
    }
    .admonition.failure p,
    .admonition.danger p,
    .admonition.bug p {
      color: white
    }
    .admonition.failure p:not(.admonition-title),
    .admonition.danger p:not(.admonition-title),
    .admonition.bug p:not(.admonition-title)  {
      opacity: 0.75
    }
    /* TODO: change this in the parser instead: can't select thoses */
    .admonition.quote .admonition-title::before {
      content: '«'
    }
    .admonition.quote .admonition-title::after {
      content: '»'
    }
    .admonition.quote .admonition-title + p::before {
      content: '—\2009'
      /*        |   |-> thin space */
      /*        |-> em dash        */
    }
</template>

<script>
//--- essentials ---
import axios from "axios";
import moment from "moment";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
//--- components ---
import TheNavbar from "~/components/TheNavbar.vue";
import ArrayButtonFlat from "~/components/ArrayButtonFlat.vue";
import ButtonFlat from "~/components/ButtonFlat.vue";
import MainGroup from "~/components/MainGroup.vue";
import MainGroupLeft from "~/components/MainGroupLeft.vue";
import MainGroupRight from "~/components/MainGroupRight.vue";
import ButtonIcon from "~/components/ButtonIcon.vue";
import BarFloating from "~/components/BarFloating.vue";

export default {
  layout: "bare",
  components: {
    TheNavbar,
    MainGroup,
    MainGroupLeft,
    MainGroupRight,
    BarFloating,
    ButtonIcon
  },

  async asyncData({ store, app, route }) {
    let error = false;
    try {
      const { data } = await app.$axios.get(`/notes/`);
      store.commit("notes/SET_NOTES", data);
    } catch (e) {
      console.error(e);
    }

    if (!store.getters.allSettings.length) {
      try {
        const { data } = await app.$axios.get("/settings/");
        store.commit("SET_SETTINGS", data);
      } catch (e) {
        console.error(e);
      }
    }

    try {
      let { uuid } = route.params;
      const { data } = await app.$axios.get(`/notes/${uuid}/`);
      return {
        name: data.name,
        subject: data.subject,
        created: data.created,
        server_last_modified: data.last_modified,
        server_content: data.content,
        uuid: data.uuid
      };
    } catch (e) {
      if (e.response.status == 404) {
        error = "Note non trouvée.";
        return {
          error
        };
        // app.$router.push('/notes')
      }
    }
  },

  data() {
    return {
      content: "Chargement...",
      lastSave: moment()
    }
  },

  mounted() {
    let content;
    let local = {
      content: window.localStorage.getItem(`${this.uuid}--noteContent`),
      modified: moment(
        window.localStorage.getItem(`${this.uuid}--noteLastModified`)
      )
    };
    let server = {
      content: this.server_content,
      modified: moment(this.server_last_modified)
    };
    if (local.modified.isAfter(server.modified)) {
      this.content = local.content;
      this.$toast.show(
        "La note enregistrée ici est plus récente que celle du serveur, et a été restaurée."
      );
      this.uploadToServer(moment().format(), local.content, true);
    } else {
      this.content = server.content;
    }

    //                         |-> keyup never fires for Ctrl-S
    window.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        this.sync()
      }
    })

    // Rough scroll syncing
    document.getElementById("editor").addEventListener("scroll", event => {
      document.getElementById("mirror").scrollTop = event.target.scrollTop;
    });

    // Slide the navabr back in only a few seconds after to show that it's here
    setTimeout(() => {
      document.getElementsByClassName('TheNavbar')[0].classList.remove('slid-out')
    }, 500);

  },

  watch: {
    content(newContent, oldContent) {
      window.localStorage.setItem(`${this.uuid}--noteContent`, newContent);
      window.localStorage.setItem(
        `${this.uuid}--noteLastModified`,
        moment().format()
      );
      this.content = newContent;
    }
  },

  computed: {
    ...mapGetters({
      note: "notes/note"
    })
  },

  methods: {
    async uploadToServer(last_modified, content, force = false, updateNoteName = false) {
      // rate limitting
      if (moment().diff(this.lastSave, "seconds") < 5 && !force) {
        this.$toast.error(
          "Veuillez attendre un peu avant de synchroniser de nouveau."
        );
        return;
      } else {
        this.lastSave = moment();
      }
      // request
      let errored = false;
      let requestData = {
        last_modified, content
      }
      // update title
      if (updateNoteName) {
        requestData.name = updateNoteName
      }
      try {
        const { data } = await this.$axios.patch(`/notes/${this.uuid}/`, requestData);
        this.$toast.success("Synchronisation réussie");
      } catch (e) {
        errored = true;
        this.$toast.error(`Erreur lors de la synchronisation: ${e}`);
      }
      if (!errored) {
        // remove from localStorage if synced correctly to avoid
        // incorrect "local version is more recent" notifications
        window.localStorage.removeItem(`${this.uuid}--noteContent`);
        window.localStorage.removeItem(`${this.uuid}--noteLastModified`);
      }
    },
    sync() {
      // update note name
      let noteName = document.getElementsByTagName('h1')[0].innerText
      this.name = noteName
      this.uploadToServer(moment().format(), this.content, false, noteName);
    },
    save_source() {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(this.content)
      );
      element.setAttribute("download", this.name);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

#editor
  padding-left: 20px // Remove conflict with navbar handle
  height: 100%
  width: 100%
  font-family: 'Roboto Mono', monospace
  font-weight: 300
  font-size: 18px
  line-height: 1.2
.MainGroupLeft, .MainGroupRight
  margin-top: 0
  height: calc(100vh - 200px)
  width: 100%
  max-width: 50vw
#mirror
  height: 100%
  width: 100%
  overflow-y: scroll
  overflow-x: hidden
  line-height: 1.3
  font-size: 18px
  *
    word-break: everywhere
</style>
