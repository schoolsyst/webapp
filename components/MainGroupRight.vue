<template>
    <div class="MainGroupRight">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'MainGroupRight',


    props: {

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
@media (min-width: 1000px) 
    .MainGroupRight 
        grid-column: 2
</style>