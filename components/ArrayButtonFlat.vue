<template lang="pug">
ul.ArrayButtonFlat
	slot
</template>

<script>
export default {
	name: "ArrayButtonFlat",
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.ArrayButtonFlat
	display: flex
	flex-wrap: wrap
	& > li
		margin-right: 2rem

</style>
