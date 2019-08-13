<template>
    <button class="FlatButton" @click="action">
        <i class="material-icons-outlined">{{icon}}</i>
        <span class="text">{{text}}</span>
    </button>
</template>

<script>
export default {
    name: 'FlatButton',
    props: [
        'action',
        'text',
        'icon',
        'shortcut' //TODO: keyboard shortcut to activate button, eg Shift+C
    ]
}
</script>

<style scoped>
button {
    border: none;
    padding: 0 10px;
    background: none;
    display: flex;
    align-items: center;
}

button:hover, button:focus {
    cursor: pointer;
    color: var(--material-blue);
    outline: none;
}

i {
    margin-right: 5px;
}

.text {
    font-size: 24px;
}
</style>