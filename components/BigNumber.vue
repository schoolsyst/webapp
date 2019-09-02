<template lang="pug">
    span.BigNumber
        span.sign(
            v-if="sign.trim()"  
            :contenteditable="writables.includes('sign' )"
            :style="{color: signColor}"
        ) {{sign}}
        span.value(
            :contenteditable="writables.includes('value')"
        ) {{valueDisp}}
        span.unit(
            v-if="unit.trim()"  
            :contenteditable="writables.includes('unit' )"
        ) {{unit}}
    </span>
</template>

<script>
export default {
    name: 'BigNumber',


    props: {
        value: {
            default: '—'
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
            default: () => []
        }
    },


    data() {
        return {
            
        }
    },

    computed: {
        signColor() {
            switch (this.sign) {
                case '+':
                    return 'var(--blue)'
                    break;

                case '-':
                    return 'var(--red)'
                    break;
            
                default:
                    return ''
                    break;
            }
        },
        valueDisp() {
            let val = Number(this.value).toFixed(2)
            // if it wasn't able to convert to a number, or the value is null/undefined
            let isUndef = val === 'NaN' || this.value === null || isNaN(this.value)

            return isUndef ? '—' : val
        }
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
    height: 96px
    line-height: 96px
    font-weight: 500


.value, .sign 
    font-size: 96px


.unit 
    font-weight: 500
    font-size: 56px
    opacity: 0.25

.sign



+mobile
    .value, .sign 
        font-size: 96px
    
    .BigNumber 
        line-height: 96px
        height: 96px
    
    .unit 
        font-size: 64px
    

</style>