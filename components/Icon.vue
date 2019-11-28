<template lang="pug">
    i(:class="className") {{iconText}}
</template>

<script>
export default {
    props: {
        filled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        className() {
            return 'material-icons' + (!this.filled ? '-outlined' : '')
        },
        iconText() {
            const rawText = this.$slots.default[0].text
            console.log(this.$slots.default)
            if (this.filled) {
                return rawText.replace('_outline','')
            } else {
                return rawText
            }
        }
    }
}


</script>
