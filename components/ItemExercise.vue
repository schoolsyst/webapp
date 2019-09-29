<template lang="pug">
//TODO: click to expand & show exercise notes, full title. Complete w/ the subject badge/dot
//TODO: On expanded notes, linkify http[s]://domain.tld and also domain.tld if domain in ICANN domains.
//TODO: expand less others when expanding this one (also for CardTest)
li.ItemExercise(:class="{'expanded': expanded && !mutCompleted}" :data-exercise-id="uuid")
  ModalDialogConfirm(
      :name="`delete-exercise-${uuid}`", 
      @confirm="deleteExercise"
      confirm-text="Supprimer",
      confirm-role="danger"
  )
    | Confirmer supprimera l'exercise "{{name}}" définitivement
  .non-expanded-content
    .main-content(
      :data-exercise-id="uuid" 
      :class="{'completed': mutCompleted, 'show-completed': showCompleted}"
      @keyup.enter="switchCompleteStatus"
      @click="switchCompleteStatus",
      tabindex="0"
    )
      SubjectDot(v-bind="subject" v-if="mnml")
      //FIXME: BadgeSubjet shouldn't be able to shrink in width
      BadgeSubject(v-bind="subject" v-else)
      h4.name {{name}}
    button.expand(
      @click="expanded = !expanded"
      v-if="!mutCompleted"
    )
      i.material-icons.icon {{expanded ? 'expand_less' : 'expand_more'}}
  .expanded-content
    p.full-name {{name}}
    textarea.notes(v-model="mutNotes", :id="`field_${uuid}-notes`", cols=0, rows=0)
    .date-and-delete
      .date
        label(:for="`field_${uuid}-date`") À faire pour le
        input(type="date" v-model="mutDue" :id="`field_${uuid}-date`")
      .delete
        ButtonFlat(:open-modal="`confirm-delete-exercise-${uuid}`", open-at="center", icon="delete" small) Supprimer
</template>

<script>
import BadgeSubject from "~/components/BadgeSubject.vue";
import SubjectDot from "~/components/SubjectDot.vue";
import ButtonFlat from "~/components/ButtonFlat.vue";
import ModalDialogConfirm from "~/components/ModalDialogConfirm.vue";
import moment from "moment";
import debounce from "lodash.debounce";
import { mapMutations } from "vuex";

export default {
  name: "ItemExercise",
  components: {
    BadgeSubject,
    SubjectDot,
    ButtonFlat,
    ModalDialogConfirm
  },
  props: {
    subject: Object,
    name: String,
    notes: String,
    uuid: String,
    due: String,
    completed: Boolean,
    showCompleted: {
      type: Boolean,
      default: true
    },
    mnml: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      badgeHasCheckmark: false,
      initialInnerHTML: "",
      lastCompletionSync: null,
      mutCompleted: this.completed,
      mutDue: this.due,
      mutNotes: this.notes,
      expanded: false
    };
  },

  methods: {
    switchCompleteStatus() {
      let item = document.querySelector(`[data-exercise-id="${this.uuid}"]`);
      this.mutCompleted = !this.mutCompleted;
      // Remove icon from badge innerHTML
      // TODO: maybe do this with a .switching class instead? (this removes focus, no good for accessibility)
      item.blur(); // Remove focus automatically, removing weird styling conflicts
      item.querySelector(
        ".BadgeSubject, .SubjectDot"
      ).innerHTML = this.initialInnerHTML;
      this.syncCompletionStatus(this.mutCompleted);
    },
    async syncCompletionStatus(completed) {
      // don't sync too much (every 5 secs. max)
      if (this.lastCompletionSync)
        console.log(moment().diff(this.lastCompletionSync, "seconds"));
      if (
        this.lastCompletionSync &&
        moment().diff(this.lastCompletionSync, "seconds") < 3
      )
        return;

      try {
        const { data } = await this.$axios.patch(`/exercises/${this.uuid}/`, {
          completed
        });
        this.lastCompletionSync = moment();
        console.log();
      } catch (error) {
        this.$toast.error(`Erreur lors de la synchronisation: ${error}`);
      }
    },
    deleteExercise() {
      try {
        this.$store.commit("homework/DELETE_EXERCISE", this.uuid);
        this.$axios.delete(`/exercises/${this.uuid}/`);
        this.$toast.success(`Contrôle de ${this.subject.name} supprimé`);
      } catch (error) {
        this.$toast.error(`Erreur lors de la suppression: ${error}`);
      }
    }
  },

  watch: {
    mutDue() {
      try {
        this.$store.commit("CHANGE_EXERCISE", this.uuid, {
          due: this.mutDue
        });
        this.$axios.patch(`/exercises/${this.uuid}/`, {
          due: this.mutDue
        });
      } catch (error) {
        this.$toast.error(
          `Impossible de changer la date de cet exercice: ${error}`
        );
      }
    },
    mutNotes: debounce(function() {
      console.log("syncing notes");
      try {
        this.$store.commit("homework/CHANGE_EXERCISE", this.uuid, {
          notes: this.mutNotes
        });
        this.$axios.patch(`/exercises/${this.uuid}/`, {
          notes: this.mutNotes
        });
      } catch (error) {
        this.$toast.error(
          `Impossible de changer les notes de cet exercice: ${error}`
        );
      }
    }, 1000)
  },

  mounted() {
    let item = document.querySelector(
      `.ItemExercise[data-exercise-id="${this.uuid}"] .main-content`
    );
    if (!item) return;
    let badge = item.querySelector(".BadgeSubject, .SubjectDot");
    this.initialInnerHTML = badge.innerHTML;

    item.addEventListener("mouseover", event => {
      if (!item.classList.contains("completed")) {
        badge.innerHTML =
          '<i class="material-icons" style="color:white;">check</span>';
      }
    });
    item.addEventListener("mouseout", event => {
      if (!item.classList.contains("completed")) {
        badge.innerHTML = this.initialInnerHTML;
      }
    });
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.ItemExercise
  //--- dimensions ---
  max-width: 90vw
.non-expanded-content
  //====   items   ====
  display: flex
  align-items: center

.expand
  .icon
    font-size: 35px
.expanded-content
  //--- dimensions ---
  height: 0
  width: 0
  overflow: hidden
  //---   spacing  ---
  padding: 0px
  //---  position  ---
  display: block
  //--- animations ---
  transition: height 0.25s ease
  //====   items   ====
  display: flex
  flex-direction: column

.date-and-delete
  display: grid
  grid-template-columns: 1fr 1fr
  width: 100%
  margin-left: 10px
  margin-top: 15px
.full-name
  text-align: center
  // font-weight: bold
  font-size: 18px
  margin-bottom: 15px
.delete, .date
  align-items: center
  display: flex
.delete
  justify-content: flex-end
.date
  font-size: 18px
  label
    margin-right: 10px
    +phone
      display: none // Not enough room on phones

.notes
  width: 100%
  background: var(--grey)
  height: 150px
  border-radius: 7.5px
  padding: 10px

.main-content
    //--- positioning ---
    position: relative
    //--- dimensions  ---
    +desktop
      max-width: 45vw
    //---   margins   ---

    //---  appearance ---
    cursor: pointer
    //---  animation  ---

    //=====  items  =====
    display: flex
    align-items: center

    //== strikethrough ==
    &::before
        content: ''
        //--- positioning ---
        position: absolute
        +tablet
          left: -20px
        +phone
          left: -10px
        //--- dimensions  ---
        height: 3px
        width: 0
        //---   margins   ---
        
        //---  appearance ---
        background: #000
        //--- animations  ---
        transition: width 0.25s ease

.BadgeSubject, .SubjectDot
    //--- positioning ---
    
    //--- dimensions  ---

    //---   margins   ---

    //---  appearance ---

    //---  animation  ---
    transition: background .125s ease
+phone 
  .BadgeSubject
    //--- dimensions ---
    width: 60px
    height: 40px
    font-size: 24px

.name
    //--- positioning ---
    margin-left: 15px
    //--- dimensions  ---
    font-size: 25px
    +tablet
      max-width: 500px
      width: calc(100% - 100px)
    +phone
      width: calc(100vw - 150px)
    //---   margins   ---
    
    //---  appearance ---
    font-weight: normal
    overflow: hidden
    //--- overflowing ---
    text-overflow: ellipsis
    height: 30px
    white-space: nowrap
    //---  animation  ---
    transition: opacity .125s ease

.SubjectDot
  //--- positioning ---
  
  //--- dimensions  ---
  height: 40px
  width: 40px
  //---   margins   ---
  
  //---  appearance ---
  color: white
  //---  animation  ---

// Reactions
// =========

//TODO: move this outta this component ?
// --- Hide completed exercises ---
.main-content:not(.show-completed).completed
  display: none

// --- hover, focus AND completed state ---
.main-content:hover,
.main-content:focus,
.main-content.completed
    outline: none
    .name
        opacity: 0.25

// --- completed state only ---
.main-content.completed
    .BadgeSubject
        opacity: 0.25
    &::before
        +tablet
          width: 45vw
        +phone
          width: calc(100vw - 20px)
        max-width: 500px

// --- hover, focus only ---
.main-content:not(.completed):hover,
.main-content:not(.completed):focus
    .BadgeSubject, .SubjectDot
        background: var(--blue) !important
        opacity: 1 !important
    .BadgeSubject /deep/ .material-icons
        font-size: 45px !important
    .SubjectDot /deep/ .material-icons
        font-size: 30px !important

// --- expanded ---
.ItemExercise.expanded 
  &
    border-bottom: 3px solid #00000040
  .expanded-content
    padding: 10px
    height: 250px
    width: 100%

</style>