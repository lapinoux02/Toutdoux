<template>
<div id="overlay">
	<div v-if="$slots['bottom-left']" id="button-bottom-left" class="button"><slot name="bottom-left"></slot></div>
	<div v-if="$slots['middle-right']" id="button-middle-right" class="button"><slot name="middle-right"></slot></div>
</div>
</template>
<script>
export default {
}
</script>
<style scoped>
#overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100svh;
	pointer-events: none;
	z-index: 10;
}
#overlay * {
	pointer-events: auto;
}
#overlay .button {
	position: absolute;
}
#overlay #button-bottom-left {
	bottom: 1rem;
	left: 1rem;
}
#overlay #button-middle-right {
	bottom: 16rem;
	right: 1rem;
}
</style>