<template>
    <div class="MainGroupLeft">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'MainGroupLeft',


}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.MainGroupLeft 
    grid-column: 1

</style>