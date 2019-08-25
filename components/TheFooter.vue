<template lang="pug">
    <footer class="TheFooter">
        OverlayLoadingLogo(animate-when="scroll-into-view")
        h6.logo-title schoolsyst
        p.logo-subtitle 
            |by 
            a(href="https://mx3creations.com") Mx3
        p.version #[code v0.0.15]
    </footer>
</template>

<script>
import HeadingSub from '~/components/HeadingSub.vue'
import OverlayLoadingLogo from '~/components/OverlayLoadingLogo.vue'
export default {
    name: 'TheFooter',

    components: {
        HeadingSub, OverlayLoadingLogo
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.TheFooter
    margin-top: 210px
    width: 100%
    height: 50vh
    +mobile
        height: 75vh
    background: var(--blue)
    position: relative
    z-index: 999
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column

.OverlayLoadingLogo
    height: 25vh
    width: 25vw
    // transform: scale(2)
.OverlayLoadingLogo /deep/ svg *
    stroke: white

.logo-title
    //--- positioning ---
    position: relative
    //--- dimensions  ---
    font-size: 50px
    //---   margins   ---
    margin-top: 20px
    //---  appearance ---
    font-family: 'Roboto Mono', monospace
    font-weight: 100
    color: #ffffff
    //---  animation  ---
    .badge
        //--- positioning ---
        position: absolute
        // bottom: 5px
        //--- dimensions  ---
        font-size: 15px
        //---   margins   ---

        //---  appearance ---
        text-transform: uppercase
        //---  animation  ---

.logo-subtitle
    //--- positioning ---
    
    //--- dimensions  ---
    font-size: 24px
    //---   margins   ---
    
    //---  appearance ---
    color: #ffffff
    //---  animation  ---
    a::after
        //--- positioning ---
        
        //--- dimensions  ---
        
        //---   margins   ---
        
        //---  appearance ---
        
        //---  animation  ---
.version
    //--- positioning ---
    position: absolute
    bottom: 20px
    //--- dimensions  ---
    font-size: 15px
    //---   margins   ---
    
    //---  appearance ---
    color: #ffffff
    //---  animation  ---
</style>