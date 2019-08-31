<template lang="pug">
//TODO: click to expand & show exercise notes, full title. Complete w/ the subject badge/dot
//TODO: On expanded notes, linkify http[s]://domain.tld and also domain.tld if domain in ICANN domains.
//TODO: Reset all fields after clicking "add" or "cancel"
//FIXME: Additionnal notes aren't sent to the DB
li.ItemExercise(
    :data-exercise-id="uuid" 
    :class="{'completed': mutCompleted, 'show-completed': showCompleted}"
    @keyup.enter="switchCompleteStatus"
    @click="switchCompleteStatus",
    tabindex="0"
)
    SubjectDot(v-bind="subject" v-if="mnml")
    BadgeSubject(v-bind="subject" v-else)
    h4.name {{name}}
    p.notes {{notes}}
</template>

<script>
import BadgeSubject from "~/components/BadgeSubject.vue";
import SubjectDot from '~/components/SubjectDot.vue'
import moment from 'moment';
import { mapMutations } from 'vuex';

export default {
  name: "ItemExercise",
  components: {
    BadgeSubject, SubjectDot
  },
  props: {
    subject: Object,
    name: String,
    notes: String,
    uuid: String,
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

  data() { return {
    badgeHasCheckmark: false,
    initialInnerHTML: '',
    lastCompletionSync: null,
    mutCompleted: this.completed
  }},

  methods: {
    switchCompleteStatus() {
      let item = document.querySelector(`[data-exercise-id="${this.uuid}"]`)
      // get the completed state from the DOM now, and invert it 
      // (the changes are reflected on the DOM *after* the method has run)
      // we need this because otherwise, syncCompletionStatus has no way
      // of knowing the completed state to switch to.
      let completed = !item.classList.contains('completed')
      this.mutCompleted = !this.mutCompleted
      // Remove icon from badge innerHTML 
      // TODO: maybe do this with a .switching class instead? (this removes focus, no good for accessibility)
      item.blur() // Remove focus automatically, removing weird styling conflicts 
      item.querySelector('.BadgeSubject, .SubjectDot').innerHTML = this.initialInnerHTML
      this.syncCompletionStatus(completed)
    },
    async syncCompletionStatus(completed) {
      // don't sync too much (every 5 secs. max)
      if (this.lastCompletionSync) console.log(moment().diff(this.lastCompletionSync, 'seconds'))
      if (this.lastCompletionSync && moment().diff(this.lastCompletionSync, 'seconds') < 3) return

      try {
        const { data } = await this.$axios.patch(`/exercises/${this.uuid}/`, { completed })
        this.lastCompletionSync = moment()
        console.log()
      } catch(error) {
        this.$toast.error(`Erreur lors de la synchronisation: ${error}`)
      }
    },
  },

  mounted() {
    let item = document.querySelector(`[data-exercise-id="${this.uuid}"]`);
    if (!item) return
    let badge = item.querySelector(".BadgeSubject, .SubjectDot");
    this.initialInnerHTML = badge.innerHTML;

    item.addEventListener("mouseover", event => {
      if (!item.classList.contains("completed")) {
        badge.innerHTML = '<i class="material-icons">check</span>';
      }
    });
    item.addEventListener("mouseout", event => {
      if (!item.classList.contains("completed")) {
        badge.innerHTML = this.initialInnerHTML;
      }
    });
  },
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.ItemExercise
    //--- positioning ---
    position: relative
    //--- dimensions  ---
    max-width: 90vw
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
.name
    //--- positioning ---
    margin-left: 15px
    //--- dimensions  ---
    font-size: 25px
    +tablet
      width: 500px
    +phone
      width: calc(100vw - 20px)
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
.ItemExercise:not(.show-completed).completed
  display: none

// --- hover, focus AND completed state ---
.ItemExercise:hover,
.ItemExercise:focus,
.ItemExercise.completed
    outline: none
    .name
        opacity: 0.25

// --- completed state only ---
.ItemExercise.completed
    .BadgeSubject
        opacity: 0.25
    &::before
        +tablet
          width: 600px + 20px * 2 + 10px
        +phone
          width: calc(100vw - 20px)
        max-width: 50vw

// --- hover, focus only ---
.ItemExercise:not(.completed):hover,
.ItemExercise:not(.completed):focus
    .BadgeSubject, .SubjectDot
        background: var(--blue) !important
        opacity: 1 !important
    .BadgeSubject /deep/ .material-icons
        font-size: 45px !important
    .SubjectDot /deep/ .material-icons
        font-size: 30px !important

</style>