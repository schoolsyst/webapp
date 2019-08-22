<template lang="pug">
    li.CardNoteAdd
        BaseCard.card
            button(@click="$emit('click')")
                i.material-icons add
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
.CardNoteFile 
    height: 300px
    width: 200px

.card 
    background: var(--offset-blue)
    height: 250px
    width: 100%
    margin-bottom: 10px
    display: flex
    align-items: center
    justify-content: center

button i
    color: var(--blue)
    font-size: 100px
</style>