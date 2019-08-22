<template lang="pug">
    nav.TheNavbar
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
        )

        NavbarButton(
            to="/settings" 
            title="Réglages"
            icon="settings"
        )

    </nav>
</template>

<script>
import NavbarButton from "~/components/NavbarButton.vue";

export default {
  name: "TheNavbar",

  components: {
    NavbarButton
  },

  updated() {
    // Fix the work_outline icon
    let badIcon = document.querySelector("nav a.bad-icon");

    badIcon.onmouseover = function(event) {
      badIcon.querySelector("i").innerText = "work";
    };
    badIcon.onmouseout = function(event) {
      badIcon.querySelector("i").innerText = "work_outline";
    };
    if (badIcon.classList.contains("current-page")) {
      badIcon.querySelector("i").innerText = "work";
    }
  },

  methods: {}
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'


nav 
    position: fixed
    @media (min-width: $bk-sidebar)
        top: 50%
        left: 20px
        transform: translateY(-50%)

    @media (max-width: $bk-sidebar - 1px)
        left: 0
        right: 0
        bottom: 0
        display: flex
        justify-content: space-around
        background: var(--offset-blue)
        padding-top: 20px
        .NavbarButton
            margin-bottom: 20px
    +mobile
        z-index: 100
        .NavbarButton[href="/notes"]
            display: none

</style>