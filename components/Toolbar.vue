<template>
    <ul class="Toolbar">
        <li v-for="btn in buttons">
            <FlatButton v-if="btn.type == 'button'" :action="btn.action" :text="btn.text" :icon="btn.icon"/>
        </li>
    </ul>
</template>

<script>
import FlatButton from "~/components/FlatButton.vue";

export default {
    name: 'Toolbar',
    props: [
        'buttons'
    ],
    components: {
        FlatButton
    }
}
</script>

<style scoped>
    ul {
        display: grid;
        grid-template-columns: repeat(2, max-content);
        grid-gap: 0 20px;
        margin-bottom: 30px;
    }
</style>