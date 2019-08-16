<template lang="pug">
ul.ArrayCardNoteFile
    slot
</template>

<script>
export default {
  name: "ArrayCardNoteFile"
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

+desktop
    .ArrayCardNoteFile 
        display: flex
        margin-top: 10px


.CardNoteFile 
    margin-right: 35px

</style>