<template lang="pug">
    li.CardNoteAdd(open-modal="add-note" open-at="center")
        BaseCard.card
            button
                i.material-icons add
        p.title Nouvelle note...
</template>

<script>
import BaseCard from "~/components/BaseCard.vue";
import SubjectDot from "~/components/SubjectDot.vue";
import moment from "moment";

export default {
  name: "CardNoteAdd",

  components: {
    BaseCard,
    SubjectDot
  },
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.CardNoteAdd
    height: 320px
    width: 220px
    &:hover
        cursor: pointer

.card /deep/
    background: var(--offset-blue)
    height: 270px
    width: 100%
    margin-bottom: 10px
    display: flex
    align-items: center
    justify-content: center

.title 
    color: var(--blue)
    text-align: center
    font-weight: 500
    font-size: 18px
    line-height: 1.2em
    display: flex
    align-items: center
    justify-content: center

button i
    color: var(--blue)
    font-size: 100px
button:focus
    outline: none
    i
        
</style>