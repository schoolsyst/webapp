<template>
    <div class="OverlayLoadingLogo" id="lottie-overlay-loading-logo">

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
  export default {
    name: 'OverlayLoadingLogo',

    mounted() {
        this.animation = lottie.loadAnimation({
            container: document.getElementById('lottie-overlay-loading-logo'),
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: '/animations/data-animate-in.json'
        })
    },
  }
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.OverlayLoadingLogo
    background-color: transparent
    width: 25%
    height: 25%
    min-width: 200px
    min-height: 200px
    display: block
    overflow: hidden
    text-align: center
    opacity: 1
</style>