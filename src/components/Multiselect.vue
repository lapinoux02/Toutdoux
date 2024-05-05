<template>
<div class="multiselect">
	<div v-for="option in options" class="multiselect-option" :class="{selected: modelValue.id === option.id}" @click="$emit('update:modelValue', option)" :key="option.id">
		<span v-if="option.icon" class="material-symbols-outlined multiselect-icon">{{ option.icon }}</span>
		{{option.label}}
	</div>
</div>
</template>
<script>
export default {
  emits: ['update:modelValue'],
	props: {
		modelValue: null,
		options: Array
	}
}
</script>
<style scoped>
.multiselect {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	gap: 1rem;
}

.multiselect .multiselect-option {
	padding: 0 0.5rem;
	border: 1px solid var(--text-color);
	color: var(--text-color);
	background: var(--bg-light);
	border-radius: 1rem;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: background 0.3s, color 0.3s;
	.multiselect-icon {
		font-size: 1.2em;
	  padding-right: 5px;
	}
}

.multiselect .multiselect-option.selected {
	background: var(--text-color);
	color: var(--bg-light);
	transition: unset;
}
</style>