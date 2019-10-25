<template lang="pug">
ul.ArrayCardNoteFile
	slot
</template>

<script>
export default {
	name: "ArrayCardNoteFile"
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.ArrayCardNoteFile 
	display: flex
	flex-wrap: wrap
	+mobile
		justify-content: center


/deep/ li
	margin-top: 25px
	margin-right: 30px
	width: 200px
	min-width: 200px

</style>
