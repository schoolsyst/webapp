<template>
<div class="container">
  <OverlayLoadingLogo/>
</div>
</template>

<script>
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'
import { mapGetters } from 'vuex';

export default {
    middleware: false,
    layout: 'bare',
    components: {
        OverlayLoadingLogo,
    },

    data() {
        return {
            // TODO: do this in a middleware, not here
            routeTimeMap: {
                // - /notes : currently in a event
                // - /homework : after the last course
                // - /bag : from 20:00 to 00:00 if tomorrow has any events
                // - /grades : when today has no events
                // - /dashboard : fallback
            }
        }
    },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
</style>