<template lang="pug">
div.CardTest
    code {{note}}
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'CardTest',

    props: {
        subject: Object,
        name: String,
        due: String,
        note: Object
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>