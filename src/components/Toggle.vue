<template>
	<div class="toggle" :class="{on: modelValue}" @click="toggle">
		<div class="point"></div><div style="font-size: 0.5rem; padding: 0 0.2rem; font-weight: bold;" :style="{color: modelValue ? 'var(--bg-light)' : 'grey'}">{{modelValue ? 'on' : 'off'}}</div>
	</div>
</template>
<script>
export default {
	name: 'toggle',
  emits: ['update:modelValue'],
	props: {
		modelValue: {
			default: false
		}
	},
	methods: {
		toggle() {
			this.$emit('update:modelValue', !this.modelValue)
		}
	}
}
</script>
<style scoped>

.toggle {
  --toggle-width: 40px;
  --toggle-height: 20px;
  --toggle-border: 2px;
	width: var(--toggle-width);
	height: var(--toggle-height);
	border: var(--toggle-border) solid grey;
	border-radius: 9999px;
	background: var(--bg-light);
	display: flex;
	cursor: pointer;
	align-items: center;
}
.toggle.on {
	flex-direction: row-reverse;
	border-color: var(--text-color);
	background: var(--text-color);
}
.toggle .point {
	width: calc(var(--toggle-height) - var(--toggle-border) * 2);
	height: calc(var(--toggle-height) - var(--toggle-border) * 2);
	border-radius: 9999px;
	background: grey;
}
.toggle.on .point {
	background: var(--bg-light);
}
</style>