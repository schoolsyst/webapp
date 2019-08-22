<template lang="pug">
.container
  TheHeading Déconnexion...
</template>

<script>
import TheHeading from '~/components/TheHeading.vue'
export default {
    components: {
        TheHeading,
    },

    mounted() {
        this.$auth.logout()
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>
