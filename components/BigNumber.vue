<template>
    <div class="BigNumber">
        <span class="sign" v-if="number.sign" :contenteditable="'sign' in number.writables">{{number.sign}}</span>
        <span class="value" v-if="number.value" :contenteditable="'value' in number.writables">{{number.value}}</span>
        <span class="unit" v-if="number.unit" :contenteditable="'unit' in number.writables">{{number.unit}}</span>
    </div>
</template>

<script>
export default {
    name: 'BigNumber',
    props: [
        'number'
    ]
}
</script>

<style scoped>
.value, .sign {
    font-size: 72px;
}

.unit {
    font-size: 36px;
}
</style>