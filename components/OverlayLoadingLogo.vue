<template>
  <div class="OverlayLoadingLogo" :class="animation" v-bind="{id}"></div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  name: "OverlayLoadingLogo",

  props: {
    animateWhen: {
      type: String,
      default: "page-loads",
    },
    animation: {
      type: String,
      default: "animate-in",
    },
  },

  computed: {
    id() {
      return 'lottie-overlay-loading-logo-' + this._uid
    }
  },

  mounted() {
    if (window.innerWidth < 500 && this.animation === 'animate-in-compound') {
      this.animation = 'animate-in'
    }

    let white =
      document.body.getAttribute('theme') === 'DARK'
      && this.animation === 'loop'
    
    if (white) console.log('white overlayloadinglogo')

    this.lottieInstance = lottie.loadAnimation({
      container: document.getElementById(this.id),
      renderer: "svg",
      loop: this.animation === "loop",
      autoplay: this.animateWhen === "page-loads",
      path: `/animations/data-${this.animation}${white ? '-white' : ''}.json`,
    })

    if (this.animateWhen !== "page-loads") {
      let self = document.getElementById(this.id)
      let app = this

      if (this.animateWhen === "scrolled-into-view") {
        // configure the intersection observer instance
        var intersectionObserverOptions = {
          root: null,
          rootMargin: "150px",
          threshold: 1.0,
        }

        var observer = new IntersectionObserver(
          onIntersection,
          intersectionObserverOptions
        )

        // provide the observer with a target
        observer.observe(self)

        function onIntersection(entries) {
          entries.forEach((entry) => {
            // Are we in viewport?
            if (entry.intersectionRatio > 0) {
              // console.log('<OverlayLoadingLogo> playing animation: scrolled-into-view')
              app.lottieInstance.play()
              // Stop watching
              observer.unobserve(entry.target)
            }
          })
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
.animate-in-compound
  min-width: 500px
  max-height: 100px
  width: 45%
</style>
