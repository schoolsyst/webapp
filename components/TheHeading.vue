<template>
    <h1 class="TheHeading">
        <slot></slot>
    </h1>
</template>

<script>
export default {
    name: 'TheHeading',


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
.TheHeading 
    font-weight: 100
    font-size: 64px
    margin-bottom: 5px

@media (min-width: 1000px) 
    .TheHeading 
        font-size: 96px
        line-height: 96px
    

</style>