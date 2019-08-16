<template>
    <div class="BaseCard">
        <slot></slot>
    </div>
</template>

<style lang="sass" scoped>
@import '~/assets/defaults'
.BaseCard 
    background-color: #ffffff
    border-radius: 10px
    padding: 20px
    margin-top: 10px
    margin-bottom: 20px

</style>