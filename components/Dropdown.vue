<template lang="pug">
    .Dropdown
        label(:for="id"): slot
        .container
            select(:id="id" @select="$emit('select', $event)")
                option(
                    v-for="option in options" 
                    :key="option.value"
                    :value="option.value"

                )
                    i.icon.material-icons-outlined(v-if="option.icon") {{option.icon}}
                    span.text {{option.label}}

</template>

<script>
import slugify from 'slugify'
export default {
    props: {
        options: {
            type: Array,
            default: () => ([])
        },
        computed: {
            id() {
                return slugify(this.$slots.default[0].text)
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
.Dropdown
    position relative
.container
    position relative
    overflow hidden // Hide the native select arrow
select
    appearance none
    width: 110% // Hide the native select arrow
    overflow hidden
    text-overflow ellipsis
</style>
