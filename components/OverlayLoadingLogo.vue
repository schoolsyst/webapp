<template>
    <div class="OverlayLoadingLogo" id="lottie-overlay-loading-logo">

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
  export default {
    name: 'OverlayLoadingLogo',

    props: {
      animateWhen: {
        type: String,
        default: 'page-loads'
      },
      animation: {
        type: String,
        default: 'animate-in'
      }
    },

    mounted() {
        this.lottieInstance = lottie.loadAnimation({
            container: document.getElementById('lottie-overlay-loading-logo'),
            renderer: 'svg',
            loop: this.animation === 'loop',
            autoplay: this.animateWhen === 'page-loads',
            path: `/animations/data-${this.animation}.json`
        })

        if (this.animateWhen !== 'page-loads') {
          let self = document.getElementById('lottie-overlay-loading-logo')
          let app = this

          if (this.animateWhen === 'scrolled-into-view') {

            // configure the intersection observer instance
            var intersectionObserverOptions = {
              root: null,
              rootMargin: '150px',
              threshold: 1.0
            }
                
            var observer = new IntersectionObserver(onIntersection, intersectionObserverOptions);

            // provide the observer with a target
            observer.observe(self);

            function onIntersection(entries){
              entries.forEach(entry => {
                
                // Are we in viewport?
                if (entry.intersectionRatio > 0) {
                  console.log('<OverlayLoadingLogo> playing animation: scrolled-into-view')
                  app.lottieInstance.play()
                  // Stop watching 
                  observer.unobserve(entry.target);
                }
              });
            }
          }
        }
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
