<template>
    <button class="ButtonLargeFlat">
        <i class="icon material-icons">add</i>
        <span class="text">
            <slot></slot>
        </span>
    </button>
</template>

<script>
export default {
    name: 'ButtonLargeFlat',


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
.ButtonLargeFlat 
    padding: 10px 0
    display: flex
    align-items: center

.icon, .text 
    color: var(--blue)

.icon 
    font-size: 64px
    margin-right: 20px

.text 
    font-size: 28px

</style>