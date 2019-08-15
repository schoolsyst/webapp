<template>
    <li class="BaseFlatComponent" :class="{'large-icon': largeIcon}">
        <label class="icon" :class="iconStyleClass" :for="labelFor">{{icon}}</label>
        <slot></slot>
    </li>
</template>

<script>

export default {
    name: 'BaseFlatComponent',


    props: {
        icon: String,
        iconStyle: {
            type: String,
            default: 'outlined'
        },
        labelFor: String,
        largeIcon: {
            type: Boolean,
            default: false
        }
    },


    data() {
        return {
            
        }
    },

    computed: {
        iconStyleClass: function() {
            return 'material-icons' + (this.iconStyle === 'baseline' ? '' : '-outlined')
        }
    },


    created() {

    },


    methods: {

    }
}
</script>

<style lang="sass" scoped>
.BaseFlatComponent 
    padding: 0 10px
    display: flex
    align-items: center
    height: 32px
    font-size: 28px


/* Switch to filled icon on hover, if it's an outlined-style icon */
.BaseFlatComponent:hover .icon.material-icons-outlined 
    font-family: 'Material Icons'



.icon
    margin-right: 5px


/* Select the elements inside <slot> */
.BaseFlatComponent label + * 
    text-align: left
    white-space: nowrap
    display: inline


/* Smaller font-size for elements inside <slot> when the `inline` option is `true` */
.ArrayButtonFlat.inline .BaseFlatComponent label + * 
    font-size: 18px

// Larger icon for text-less buttons
.BaseFlatComponent.large-icon .icon 
    font-size: 84px

.BaseFlatComponent:hover .icon
    cursor: pointer //TODO remove this

</style>