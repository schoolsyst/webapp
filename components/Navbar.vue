<template>
    <nav class="Navbar">
        <li v-for="lnk in pages" :key="lnk.name" :class="lnk.name == currentPage ? 'current-page' : ''">
            <nuxt-link :to="lnk.url" :title="lnk.name">
                <i class="material-icons">{{lnk.icon}}</i>
            </nuxt-link>
        </li>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',
    props: [
        'currentPage'
    ],
    data() {
        return {
            pages: [
                {
                    icon: 'home',
                    name: 'dashboard',
                    url : '/'
                },
                {
                    icon: 'insert_drive_file',
                    name: 'notes',
                    url : '/notes'
                },
                {
                    icon: 'calendar_today',
                    name: 'schedule',
                    url : '/schedule'
                },
                {
                    icon: 'school',
                    name: 'grades',
                    url : '/grades'
                },
                {
                    icon: 'book',
                    name: 'homework',
                    url : '/homework'
                },
                {
                    icon: 'settings',
                    name: 'settings',
                    url : '/settings'
                }
            ]
        }
    }
}

let toggleIconStyle = style => {
    switch (style) {
        case 'filled':
            this.classList.replace('material-icons-outlined', 'material-icons')
            break;
    
        case 'outlined':
            this.classList.replace('material-icons', 'material-icons-outlined')
            break;
    }
}
</script>

<style scoped>
li.current-page::before {
    content: '';
    background-color: var(--offset-blue);
    height: 60px;
    width: 60px;
    border-radius: 50%;
    position: absolute;
    z-index: -1;
}

nav {
    position: fixed;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
}
</style>