<template lang="pug">
nav.TheNavbar(:class="{'slide-out': slideOut}", tabindex="1")
    NavbarButton(
        to="/"         
        title="Dashboard"
        icon="home"
    )

    NavbarButton(
        to="/notes"    
        title="Prises de notes"
        icon="insert_drive_file"
    )

    NavbarButton(
        to="/homework" 
        title="Devoirs"
        icon="book"
    )

    NavbarButton(
        to="/schedule" 
        title="Emploi du temps"
        icon="calendar_today"
    )

    NavbarButton(
        to="/grades"   
        title="Notes & moyennes"
        icon="school"
    )

    NavbarButton(
        to="/bag"      
        title="Sac"
        icon="work_outline"
    ).bad-icon

    NavbarButton(
        to="/settings" 
        title="Réglages"
        icon="settings"
    )

</template>

<script>
import NavbarButton from "~/components/NavbarButton.vue";

export default {
  name: "TheNavbar",

  components: {
    NavbarButton
  },

  props: {
    slideOut: {
      type: Boolean,
      default: false
    }
  },

  updated() {
    // Fix the work_outline icon
    let badIcon = document.querySelector("nav a.bad-icon");

      badIcon.addEventListener('mouseover', event => {
        if (!badIcon.classList.contains("current-page")) {
          badIcon.querySelector("i").innerText = "work";
        }
      });
      badIcon.addEventListener('mouseout', event => {
        if (!badIcon.classList.contains("current-page")) {
          badIcon.querySelector("i").innerText = "work_outline";
        }
      });
  },

  methods: {}
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

$nav-padding: 20px
.TheNavbar
  position: fixed
  @media (min-width: $bk-sidebar)
    top: 50%
    // DO this instead of left -20px
    // because hovering in the gap 
    padding-left: $nav-padding
    left: 0
    transform: translateY(-50%)
    .NavbarButton:not(:last-child)
      margin-bottom: 20px

  //TODO hide on scroll on mobile ?
  @media (max-width: $bk-sidebar - 1px)
    left: 0
    right: 0
    bottom: 0
    display: flex
    justify-content: space-around
    background: white
    +shadow(5)
    padding-top: 20px
    padding-bottom: 20px
  +mobile
    z-index: 100
    .NavbarButton[href="/schedule"]
      display: none

+tablet
  .TheNavbar.slide-out
    // positioning
    left: -95px
    // dimensions
    padding: $nav-padding
    // appearance
    background: #000
    border-top-right-radius: 10px
    border-bottom-right-radius: 10px
    box-shadow: none
    .NavbarButton
      opacity: 0
    // animations
    transition: all 0.25s ease
    .NavbarButton
      transition: opacity 0.25s ease 0.25s
    // reactions
    &:hover, &:focus, &.slid-out
      background: #ffffff
      +shadow(3)
      left: 0
      .NavbarButton
        opacity: 1
</style>
