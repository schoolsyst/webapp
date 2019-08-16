<template>
<div class="container">
</div>
</template>

<script>
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'
import { mapGetters } from 'vuex';

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
        if (this.token) {
            $nuxt.$router.push('/dashboard')
        } else {
            window.location.href = "/login"
        }
    },

    computed: {
        ...mapGetters({
            token: 'auth/token'
        })
    },

    methods: {
        redirect() {
            if (this.token) {
                this.$router.push('/dashboard')
            } else {
                this.$router.push('/login')
            }
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.OverlayLoadingLogo
    position: fixed
    left: 50%
    top: 50%
    transform: translate3d(0,0,0) translate(-50%, -50%)
</style>