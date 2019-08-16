<template>
    <span class="BigNumber">
        <span class="sign"  v-if="sign.trim()"  :contenteditable="'sign' in writables">{{sign}}</span>
        <span class="value" v-if="value"        :contenteditable="'value'in writables">{{value}}</span>
        <span class="unit"  v-if="unit.trim()"  :contenteditable="'unit' in writables">{{unit}}</span>
    </span>
</template>

<script>
export default {
    name: 'BigNumber',


    props: {
        value:{
            type: Number,
            required: true
        },
        sign: {
            // one of +, -, ±—or no sign indication.
            validator: function(value){ return value.match(/\+|-|±| /) },
            default: ' '
        },
        unit: {
            type:String,
            default: ''
        },
        writables: {
            type: Array,
            default: []
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
@import '~/assets/defaults'
.BigNumber 
    height: 144px
    line-height: 144px


.value, .sign 
    font-size: 144px


.unit 
    font-size: 72px


+mobile
    .value, .sign 
        font-size: 96px
    
    .BigNumber 
        line-height: 96px
        height: 96px
    
    .unit 
        font-size: 64px
    

</style>