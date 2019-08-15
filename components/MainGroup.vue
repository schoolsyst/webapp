<template>
    <main class="MainGroup" :class="{'full-size': fullSize}">
        <slot></slot>
    </main>
</template>

<script>
export default {
    name: 'MainGroup',


    props: {
        fullSize: {
            type: Boolean,
            default: false
        }
    },


    data() {
        return {
            
        }
    },

    computed: {
        
    },


    created() {

    },


    methods: {

    }
}
</script>

<style lang="sass" scoped>
//SHARED
.MainGroup:not(.full-size) 
  display: grid

//DESKTOP
@media (min-width: 1000px) 
  .MainGroup:not(.full-size) 
    grid-template-columns: repeat(2, 1fr)
  

//MOBILE
@media (max-width: 999px) 
  .MainGroup:not(.full-size) 
    grid-template-columns: 1fr
</style>