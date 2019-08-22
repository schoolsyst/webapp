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
    title: String
  },

  methods: {
    isCurrentPage() {
      if (this.to === "/") {
        return this.to == this.$route.path;
      } else {
        return this.$route.path.startsWith(this.to);
      }
    }
  }
};
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
    font-size: calc((100vw - 30px) / 6 / 1.5 - 5px)
    @media (min-width: $bk-sidebar)
        font-size: 40px
    user-select: none

@media (min-width: $bk-sidebar)
    .NavbarButton.current-page 
        background-color: var(--offset-blue)

.NavbarButton:hover i,
.NavbarButton.current-page i,
.NavbarButton:focus i
    color: var(--blue)
    font-family: 'Material Icons'

</style>