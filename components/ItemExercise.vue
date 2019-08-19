<template lang="pug">
li.ItemExercise(
    :data-exercise-id="uuid" 
    :class="{'completed': completed}"
    @keyup.enter="markAsComplete"
    @click="markAsComplete",
    tabindex="0"
)
    BadgeSubject(
        v-bind="subject",
    )
    h4.name {{name}}
    p.notes {{notes}}
</template>

<script>
import BadgeSubject from "~/components/BadgeSubject.vue";

export default {
  name: "ItemExercise",
  components: {
    BadgeSubject
  },
  props: {
    subject: Object,
    name: String,
    notes: String,
    uuid: String,
    completed: Boolean
  },

  data: {
    badgeHasCheckmark: false,
    initialInnerHTML: ''
  },

  methods: {
    async markAsComplete() {
      let requestData = {
        subject: this.subject.slug,
        name: this.name,
        notes: this.notes,
        completed: true
      };

      try {
        const { data } = await this.$axios.patch(
          `/exercises/${this.uuid}/`,
          requestData
        );
        this.completed = true;
        // Remove icon from badge innerHTML
        document.querySelector(`[data-exercise-id="${this.uuid}"] .BadgeSubject`).innerHTML = this.initialInnerHTML
      } catch (error) {
        this.$toast.error(
          `Impossible de marquer l'exercice comme terminé: ${error}`
        );
      }
    }
  },

  mounted() {
    let item = document.querySelector(`[data-exercise-id="${this.uuid}"]`);
    let badge = item.querySelector(".BadgeSubject");
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
  }
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

.BadgeSubject
    //--- positioning ---
    
    //--- dimensions  ---
    
    //---   margins   ---

    //---  appearance ---

    //---  animation  ---

.name
    //--- positioning ---
    margin-left: 20px
    //--- dimensions  ---
    font-size: 25px
    max-width: 500px
    //---   margins   ---
    
    //---  appearance ---
    font-weight: normal
    overflow: hidden
    //--- overflowing ---
    text-overflow: ellipsis
    height: 30px
    white-space: nowrap
    //---  animation  ---
    // transition: opacity .125s ease

// Reactions
// =========

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

// --- hover, focus only ---
.ItemExercise:not(.completed):hover,
.ItemExercise:not(.completed):focus
    .BadgeSubject
        background: var(--blue) !important
        opacity: 1 !important
        // font-family: 'Material Icons' !important
        & /deep/ .material-icons
            font-size: 45px !important

</style>