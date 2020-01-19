<template>
  <div v-bind="{ id }" :class="animation" class="OverlayLoadingLogo"></div>
</template>

<script>
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
  computed: {
    id() {
      return 'lottie-overlay-loading-logo-' + this._uid
    }
  },
  mounted() {
    if (window.innerWidth < 500 && this.animation === 'animate-in-compound') {
      this.animation = 'animate-in'
    }

    const white =
      document.body.getAttribute('theme') === 'DARK' &&
      this.animation === 'loop'

    this.lottieInstance = window.lottie.loadAnimation({
      container: document.getElementById(this.id),
      renderer: 'svg',
      loop: this.animation === 'loop',
      autoplay: this.animateWhen === 'page-loads',
      path: `/animations/data-${this.animation}${white ? '-white' : ''}.json`
    })

    if (this.animateWhen !== 'page-loads') {
      const self = document.getElementById(this.id)
      const app = this

      if (this.animateWhen === 'scrolled-into-view') {
        // configure the intersection observer instance
        const intersectionObserverOptions = {
          root: null,
          rootMargin: '150px',
          threshold: 1.0
        }
        const onIntersection = function(entries) {
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
        const observer = new IntersectionObserver(
          onIntersection,
          intersectionObserverOptions
        )

        // provide the observer with a target
        observer.observe(self)
      }
    }
  }
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
