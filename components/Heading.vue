<template>
    <h1 class="title">
        {{content}}
    </h1>
</template>

<script>
export default {
    name: 'Heading',
    props: [
        'content'
    ],
}
</script>

<style scoped>
    h1 {
        font-weight: 100;
        font-size: 64px;
    }
</style>