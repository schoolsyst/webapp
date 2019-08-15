<template>
    <nav class="TheNavbar">
        <NavbarButton
            to="/dashboard"         
            title="Dashboard"
            icon="home"
        />

        <NavbarButton
            to="/notes"    
            title="Prises de notes"
            icon="insert_drive_file"
        />

        <NavbarButton
            to="/homework" 
            title="Devoirs"
            icon="book"
        />

        <NavbarButton
            to="/schedule" 
            title="Emploi du temps"
            icon="calendar_today"
        />

        <NavbarButton
            to="/grades"   
            title="Notes & moyennes"
            icon="school"
        />

        <NavbarButton
            to="/bag"      
            title="Sac"
            icon="work_outline"
        />

        <NavbarButton
            to="/settings" 
            title="Réglages"
            icon="settings"
        />

    </nav>
</template>

<script>
import NavbarButton from '~/components/NavbarButton.vue'


export default {
    name: 'TheNavbar',

    components: {
        NavbarButton
    },

    updated: function() {
        // Fix the work_outline icon
        let badIcon = document.querySelector('nav a.bad-icon')

        badIcon.onmouseover = function(event) {
            badIcon.querySelector('i').innerText = 'work'
        }
        badIcon.onmouseout = function(event) {
            badIcon.querySelector('i').innerText = 'work_outline'
        }
        if (badIcon.classList.contains('current-page')) {
            badIcon.querySelector('i').innerText = 'work'
        }
    },

    methods: {
    },
}
</script>

<style lang="sass" scoped>

nav 
    position: fixed
    top: 50%
    right: 20px
    transform: translateY(-50%)


</style>