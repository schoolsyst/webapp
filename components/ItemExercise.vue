<template lang="pug">
//TODO: caret to show exercise notes
li.ItemExercise(
    :data-exercise-id="uuid" 
    :class="{'completed': completed, 'show-completed': showCompleted}"
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
    //TODO: finish this (checkbox to show or not completed items)
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
    lastCompletionSync: null
  }},

  methods: {
    switchCompleteStatus() {
      //TODO: change this in the store, and also sync everything onBeforeRouteLeave in the pages component.
      this.$store.commit('homework/SWITCH_EXERCISE_COMPLETED', this.uuid)
      // Remove icon from badge innerHTML 
      let item = document.querySelector(`[data-exercise-id="${this.uuid}"]`)
      // TODO: maybe do this with a .switching class instead? (this removes focus, no good for accessibility)
      item.blur() // Remove focus automatically, removing weird styling conflicts 
      item.querySelector('.BadgeSubject, .SubjectDot').innerHTML = this.initialInnerHTML
      this.syncCompletionStatuses()
    },
    async syncCompletionStatuses() {
      // don't sync too much (every 5 secs. max)
      if (this.lastCompletionSync && this.lastCompletionSync.diff(moment(), 'seconds') < 5) return

      try {
        const { data } = await this.$axios.patch(`/exercises/${this.uuid}/`, { completed: this.completed })
        this.lastCompletionSync = moment()
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
        left: -20px
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
    min-width: 500px
    max-width: calc(50vw - 50px)
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

//TODO: move this outta this component (use a filter in the ArrayGroupedItemExercise)
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
        width: 600px + 20px * 2 + 10px
        max-width: 50vw

// --- hover, focus only ---
.ItemExercise:not(.completed):hover,
.ItemExercise:not(.completed):focus
    .BadgeSubject, .SubjectDot
        background: var(--blue) !important
        opacity: 1 !important
        // font-family: 'Material Icons' !important
        & /deep/ .material-icons
            font-size: 45px !important

</style>