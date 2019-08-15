<template>
<div class="container">
    <OverlayLoadingLogo/>
</div>
</template>

<script>
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'

export default {
    layout: 'bare',
    components: {
        OverlayLoadingLogo,
    },

    data() {
        return {
            // TODO
            routeTimeMap: {
                // - /notes : currently in a event
                // - /homework : after the last course
                // - /bag : from 20:00 to 00:00 if tomorrow has any events
                // - /grades : when today has no events
                // - /dashboard : fallback
            }
        }
    },

    mounted() {
        document.getElementById('lottie-overlay-loading-logo').addEventListener('complete', event => {
            console.log('Animation ended')
            this.$router.push('/dashboard')
        })
    },

    computed: {

    },
}
</script>

<style lang="sass" scoped>
.OverlayLoadingLogo
    position: fixed
    left: 50%
    top: 50%
    transform: translate3d(0,0,0) translate(-50%, -50%)
</style>