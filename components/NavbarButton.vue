<template lang="pug">
nuxt-link.NavbarButton(
    :to="to" 
    :class="{'current-page': isCurrentPage(), 'bad-icon': icon == 'work_outline'}"
    :title="title"
)
    i.material-icons-outlined {{ icon }}
</template>

<script>
export default {
  name: "NavbarButton",
  props: {
    to: String,
    icon: String,
    title: String,
  },

  methods: {
    isCurrentPage() {
      let currentPage

      if (this.to === "/") {
        currentPage = this.to == this.$route.path
      } else {
        currentPage = this.$route.path.startsWith(this.to)
      }

      return currentPage
    },
  },

  updated() {
    if (this.$route.path.startsWith("/bag")) {
      document.querySelector(".NavbarButton.bad-icon i").innerHTML = "work"
    } else {
      document.querySelector(".NavbarButton.bad-icon i").innerHTML =
        "work_outline"
    }
  },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.NavbarButton 
  &:focus
    outline: none
  background-color: transparent
  width: 100%
  @media (min-width: $bk-sidebar)
      height: 64px
      width: 64px
  border-radius: 50%
  display: flex
  justify-content: center
  align-items: center

.NavbarButton i 
    font-size: calc((100vw - 30px) / 6 / 1.5 - 10px)
    // The automatic font-size becomes ridiculously high for vw >= 500
    @media (min-width: 450px)
      font-size: 40px
    user-select: none

@media (min-width: $bk-sidebar)
    .NavbarButton.current-page 
        background-color: var(--blue-offset)

.NavbarButton:hover i,
.NavbarButton.current-page i,
.NavbarButton:focus i
    color: var(--blue)
    font-family: 'Material Icons'

</style>
