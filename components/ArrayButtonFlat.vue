<template>
    <ul class="ArrayButtonFlat" :class="{'inline': inline}">
        <slot></slot>
    </ul>
</template>

<script>
export default {
    name: 'ArrayButtonFlat',


    props: {
        inline: {
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

.ArrayButtonFlat:not(.inline)
    margin-top: 10px

@media (min-width: 1000px) 
    .ArrayButtonFlat 
        width: 50%
    

    .ArrayButtonFlat.inline 
        display: inline
    

    .HeadingSub, .ButtonFlat 
        display: inline
    


@media (min-width: 500px) 
    .ArrayButtonFlat 
        display: grid
        grid-template-columns: repeat(2, 1fr)
    

    .ArrayButtonFlat.inline 
        display: inline-grid
        padding-left: 30px

</style>