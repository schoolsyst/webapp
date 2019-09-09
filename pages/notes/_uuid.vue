<template lang="pug">
//FIXME: sometimes the modification date is null (not shown atleast)
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
  //TODO: battery & hour & time remaining before end of course in status bar

.container
  ModalAddNote(:subject="currentCourseSubject")
  ModalAddExercise(:subject="currentCourseSubject")
  ModalAddTest(:subject="currentCourseSubject")


  TheNavbar(slide-out).slid-out
  BarFloating
    ButtonIcon(@click="saveSource" title="Télécharger la source (.md)") archive
    //TODO: Ripple effect when @click on sync btn
    ButtonIcon(@click="sync"        title="Synchroniser") import_export
    ButtonIcon(@click="savePDF" title="Télécharger le rendu (.pdf)") file_copy
  MainGroup
    MainGroupLeft
      textarea#editor(v-model="content") 
    MainGroupRight(v-if="content")
      #mirror(v-html="$md.render(content)")
    .bottom-bar
      ul.status
        li(v-if="timeRemaining", title="Temps avant la fin du cours") {{timeRemaining.format(`H[h]m`)}}
        li {{now.format('HH:mm')}}
      ArrayButtonFlat.actions
        ButtonFlat(
          icon='note_add', 
          open-modal="add-note", 
          open-at="self"
        ) Nouveau chapitre
        ButtonFlat(
          icon='edit', 
          open-modal="add-exercise", 
          open-at="center"
        ) Devoir
        ButtonFlat(
          icon='format_list_bulleted'
          open-modal="add-test",
          open-at="center"
        ) Contrôle
  style.
    h2 {
      margin-top: 20px;
      margin-bottom: 5px;
      font-weight: 500;
      font-size: 45px;
    }
    h1 {
      font-family: 'Google Sans', 'Product Sans', 'Manrope', sans-serif;
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
      line-height: 1.2
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
    .admonition.bug p,
    .admonition.failure ul li,
    .admonition.danger ul li,
    .admonition.bug ul li {
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

    ul {
      padding-left: 15px;
      list-style: disc;
    }

    ul li {
      list-style: '• '
    }

    dd {
      padding-left: 15px;
      margin-bottom: 5px;
    }

    dd:before {
      content: '•';
      margin-right: 5px;
    }

    dt {
      margin-top: 15px;
      font-weight: bold;
    }

    dt math {
      font-weight: normal; /* bold math is ugly as hell */
    }

    #mirror a, #mirror a:hover, #mirror a:focus {
      text-decoration: underline
    }

    table {
      background: var(--offset-blue);
      border-radius: 7.5px;
      border: none;
      border-collapse: collapse;
    }
    thead tr,
    thead td {
      color: var(--blue);
    }
    thead:empty {
      display: none
    }
    thead th {
      font-weight: normal;
    }
    thead th math {
      /* bold mathematics are ugly */
      font-weight: normal;
    }
    tbody tr {
      background: #fff;
    }
    tbody tr,
    tbody td {
      border-top: 2px solid #0005;
      border-bottom: 2px solid #0005;
    }
    td,
    tr {
      padding: 20px;
    }
    th {
      padding: 10px 20px;
    }
    tbody tr:hover {
      background: #fff3;
    }

    blockquote {
      padding-left: 15px;
      border-left: 7.5px solid var(--blue)
    }
</template>


<script>
//--- essentials ---
import axios from "axios";
import moment from "moment";
import platform from 'platform';
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
import ModalAddExercise from "~/components/ModalAddExercise.vue";
import ModalAddNote from "~/components/ModalAddNote.vue";
import ModalAddTest from "~/components/ModalAddTest.vue";
export default {
  layout: "bare",
  components: {
    TheNavbar,
    MainGroup,
    MainGroupLeft,
    MainGroupRight,
    BarFloating,
    ButtonIcon,
    ArrayButtonFlat,
    ButtonFlat,
    ModalAddNote,
    ModalAddExercise,
    ModalAddTest,
  },

  async asyncData({ store, app, route }) {
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
      lastSave: moment(),
      now: moment(),
      autosyncInterval: null,
      shortcuts: [
        {
            name: "Gras",
            shortcut: ["Control", "b"],
            content: ["*", "*"]
        },
        {
            name: "Italique",
            shortcut: ["Control", "i"],
            content: ["_", "_"]
        },
        {
            name: "Souligné",
            shortcut: ["Control", "u"],
            content: ["__", "__"]
        },
        {
            name: "Titre de 2e niveau",
            shortcut: ["Control", "é"],
            content: ["\n## ", ""]
        },
        {
            name: "Titre de 3e niveau",
            shortcut: ["Control", "\""],
            content: ["\n### ", ""]
        },
        {
            name: "Maths (en ligne)",
            shortcut: ["Control", "e"],
            content: ["$$", "$$"]
        },
        {
            name: "Maths (centré)",
            shortcut: ["Control", "m"],
            content: ["\n$$$\n", "\n$$$"]
        },
        {
            name: "Insérér un tableau",
            shortcut: ["Alt", "t"],
            exec: (listenerEl) => {
                // Get array of column names for user
                let cols = prompt("Titre des colonnes (séparées par des virgules)...")
                          .split(',')
                          .map(col => col.trim())
                // Return nothing (just the cursor) if the array is empty
                if (!cols.length) return ["", ""]

                // Get the biggest number out of: longest-length column name OR 50
                let colLength = Math.max(
                  cols.sort((a, b) => b.length - a.length)[0].length,
                  Math.floor(50 / cols.length - cols.length+1)
                )
                // Compute the table's header separator
                let headerSep = '|' + ('-'.repeat(colLength) + '|').repeat(cols.length)
                // Compute the table's header
                let header = '|'
                // For each column...
                cols.forEach(col => {
                    // Get the name, padded by spaces
                    name = col.padEnd(colLength, ' ')
                    // Append it to the header str
                    header = header.concat(name + '|')
                });

                // Return the whole thing
                return [`\n${header}\n${headerSep}\n|`, ""]
            }
        },
        {
            name: "Tracer une équation de droite",
            shortcut: ["Control", "p"],
            content: ["\n```plot\nplot ", "\n```"],
        },
        {
            name: "Insérer un bloc de code",
            shortcut: ["Control", "l"],
            exec: (listenerEl) => {
                let lang = prompt("Langage de ce bloc de code ?").toLowerCase()
                return [`\n\`\`\`${lang}\n`, "\n```"]
            }
        },
        {
          name: "Insérér une boite d'infos",
          shortcut: ['Control', 'q'],
          exec: (listenerEl) => {
            let title = prompt("Titre de la boîte ?").trim()
            return [`\n!!! info ${title}\n`, '\n!!!']
          }
        },
        {
          name: "Insérer une boîte \"Attention\"",
          shortcut: ['Control', 'Alt', 'q'],
          exec: (listenerEl) => {
            let title = prompt("Titre de la boîte ?").trim()
            return [`\n!!! danger ${title}\n\n`, '!!!']
          }
        }

    ]
    }
  },

  mounted() {
    setInterval(() => {
      this.now = moment()
    }, 1000);
    let content;
    let editor = document.getElementById('editor')
    let mirror = document.getElementById('mirror')
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
      this.uploadToServer(local.content, true);
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

    // Keyboard shortcuts
    /**
    Depends on platform.js

    listenerElement: queryselector to input element to modify text in
    shortcutsMap: Array[Object]: {
        name: String,
        shortcut: Array of keyboard event names
        content: Array [before cursor, after cursor] 
            (or) 
        exec: function: (listenerElement) => content
    }
    keyReprMode: String: "asTyped"||"fullName"||"keyCode": 
        uses respectively event.key, event.code and event.keyCode
    */
    const KBShortcuts = (listenerElement, shortcutsMap, keyReprMode = 'asTyped') =>{
        console.log(`[KBShortcuts] Loaded ${shortcutsMap.length} shortcut(s)`)
        console.log(`[KBShortcuts] Listening for shortcuts on ${listenerElement}`)
        const $ = document.querySelector.bind(document)
        const e = $(listenerElement)
        // Key(s) released
        e.addEventListener('keydown', event => {
            if (true) {
                // Gather the keystrokes
                let keystrokes = []
                // Ctrl or Cmd based on OS (this requires platform.js)
                let ctrlOrCmd = platform.os.family === 'OS X' ? event.metaKey : event.ctrlKey
                if (ctrlOrCmd) keystrokes.push('Control')
                if (event.shiftKey) keystrokes.push('Shift')
                if (event.altKey) keystrokes.push('Alt')
                switch(keyReprMode) { // Choose which key naming to use
                    case 'asTyped':
                        keystrokes.push(event.key)
                        break
                    case 'fullName':
                        keystrokes.push(event.code)
                        break
                    default:
                        keystrokes.push(event.keyCode)
                        break
                }

                const arrayEqual = (arr1, arr2) => {
                    arr1 = arr1.sort()
                    arr2 = arr2.sort()
                    if (arr1.length !== arr2.length) return false
                    for (let i=0;i<arr1.length;i++) {
                        if (arr1[i] !== arr2[i]) return false
                    }
                    return true
                }

                // Get corresponding shortcut body (repr)
                let repr = null
                shortcutsMap.forEach(shortcut => {
                    if (arrayEqual(keystrokes, shortcut.shortcut)) {
                        console.log(`[KBShortcuts] catched keystrokes ${keystrokes.join(' + ')}`)
                        if ('exec' in shortcut) {
                          repr = shortcut.exec(e)
                        } else {
                          repr = shortcut.content
                        }
                    }
                })


                // Get what to put before & after the cursor

                if (repr && repr.length) {
                    console.log('preventing default')
                    event.preventDefault(event)
                    let before = repr[0]
                    let after = repr[1]
                    before = e.value.substring(0, e.selectionStart) + before
                    after  = after + e.value.substring(e.selectionStart)
                    let curPos = e.selectionStart + before.length
                    let isSelection = e.selectionStart !== e.selectionEnd
                    if (!isSelection) {
                        console.log(`--- ${keystrokes.join('+')} ---`)
                        console.log(`${before}%c|%c${after}`, 'color: red;', 'color: black;')
                        console.log('------------')

                        e.value = before+after
                        e.selectionStart = e.selectionEnd = before.length
                    } else {
                        let selected = e.value.substring(e.selectionStart, e.selectionEnd)
                        e.value = before+selected+after
                        e.selectionStart += before.length
                        e.selectionEnd -= after.length
                    }
                    return false
                }
            }
        })
    }
    KBShortcuts('#editor', this.shortcuts)

    // Scroll mirror to bottom (because scroll is broken af)
    editor.addEventListener("scroll", event => {
      mirror.scrollTop = mirror.scrollHeight
    });

    // Slide the navabr back in only a few seconds after to show that it's here
    setTimeout(() => {
      document.getElementsByClassName('TheNavbar')[0].classList.remove('slid-out')
    }, 500);

    //TODO: get setting from API
    let autosave = 5

    this.autosyncInterval = setInterval(() => {
      this.$toast.info('Sauvegarde automatique...')
      this.sync()
    }, autosave * 60 * 1000);
  },

  beforeRouteLeave(to, from, next) {
    clearInterval(this.autosyncInterval)
    this.sync(true)
    next()
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
      note: "notes/noteByUUID",
      currentCourse: "schedule/currentCourse",
      fCurrentCourseSubject: "schedule/currentCourseSubject",
    }),
    timeRemaining() {
      let currentCourse = this.currentCourse(this.now)
      if (!currentCourse) return null
      let seconds = Math.abs(moment(currentCourse.end, 'HH:mm').diff(moment(), 'seconds'))
      return moment().startOf('day').seconds(seconds)
    },
    currentCourseSubject() {
      return this.fCurrentCourseSubject(this.now)
    },
  },

  methods: {
    async uploadToServer(content, force = false, updateNoteName = false) {
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
        last_modified: moment().toISOString(), 
        content
      }
      // update title
      if (updateNoteName) {
        requestData.name = updateNoteName
      }
      try {
        const { data } = await this.$axios.patch(`/notes/${this.uuid}/`, requestData);
        this.$toast.success(`Note "${data.name}" sauvegardée`);
      } catch (e) {
        errored = true;
        this.$toast.error(`Erreur lors de la sauvegarde: ${e}`);
      }
      if (!errored) {
        // remove from localStorage if synced correctly to avoid
        // incorrect "local version is more recent" notifications
        window.localStorage.removeItem(`${this.uuid}--noteContent`);
        window.localStorage.removeItem(`${this.uuid}--noteLastModified`);
      }
    },
    sync(force = false) {
      // update note name
      let noteName = document.getElementsByTagName('h1')[0].innerText
      this.name = noteName
      this.$store.commit('notes/UPDATE_NOTE', {uuid: this.uuid, data: {name: this.name}})
      this.uploadToServer(this.content, force, noteName);
    },
    saveSource() {
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
    },
    savePDF() {
      alert("Fonctionnalité non disponible")
    }
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.MainGroup
  //--- positioning ---
  
  //--- dimensions  ---
  
  //---   margins   ---
  margin-top: 20px
  //---  appearance ---
  
  //---  animation  ---
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

+mobile
  .MainGroupRight
    height: auto
    max-width: 100vw
  .MainGroupLeft, .bottom-bar
    display: none
  .container
    overflow-y: scroll

.BarFloating
  +mobile
    display: none

#mirror
  height: 100%
  width: 100%
  overflow-y: scroll
  overflow-x: hidden
  line-height: 1.3
  font-size: 18px
  *
    word-break: everywhere

  +mobile
    height: auto
    overflow: visible
    & /deep/ h1
      font-size: 48px !important

.status
  position: fixed
  bottom: 20px
  right: 20px
  //---------------------------------------------------
  display: flex
  li
    font-size: 24px
    //---------------------------------------------------
    &:not(:last-child)
      margin-right: 20px
    //---------------------------------------------------
    font-family: 'Roboto Mono', monospace
    list-style: none

.actions
  position: fixed
  bottom: 20px
  left: 0px
  //---------------------------------------------------
  display: flex
  li
    font-size: 24px

</style>
