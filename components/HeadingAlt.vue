<template>
    <h2 class="HeadingAlt" :class="{'has-inline-buttons': hasInlineButtons}">
        <slot></slot>
    </h2>
</template>

<script>
export default {
    name: 'HeadingAlt',


    props: {
        hasInlineButtons: {
            type: Boolean,
            default: false
        },
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
.HeadingAlt 
    font-weight: bold
    margin-top: 20px
    font-size: 48px

.HeadingAlt.has-inline-buttons 
    display: inline-flex
    align-items: center

@media (min-width: 1000px)
    .HeadingAlt
        white-space: nowrap
        max-width: 50vw

</style>