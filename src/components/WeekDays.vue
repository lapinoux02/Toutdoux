<template>
<div class="week-days">
	<div v-for="day in days" @click="handleClick(day)" class="day" :class="{selected: isSelected(day)}">{{day.name}}</div>
</div>
</template>
<script>
export default {
  emits: ['update:modelValue'],
	props: {
		modelValue: null
	},
	data() {
		return {
			days: [
				{id: 1, name: 'L'},
				{id: 2, name: 'M'},
				{id: 3, name: 'M'},
				{id: 4, name: 'J'},
				{id: 5, name: 'V'},
				{id: 6, name: 'S'},
				{id: 0, name: 'D'}
			]
		}
	},
	methods: {
		isSelected(day) {
			return this.modelValue.findIndex(e => e.id === day.id) !== -1
		},
		handleClick(day) {
			let dayIndex = this.modelValue.findIndex(e => e.id === day.id)
			if (dayIndex === -1) {
				this.$emit('update:modelValue', [...this.modelValue, day])
			} else {
				this.$emit('update:modelValue', this.modelValue.filter(e => e.id !== day.id))
			}
		}
	}
}
</script>
<style scoped>
.week-days {
	display: flex;
	gap: 1rem;
}
.week-days .day {
	width: 1.5rem;
	height: 1.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 1.5rem;
	border: 1px solid var(--text-color);
	color: var(--text-color);
	font-size: 0.8rem;
	transition: background 0.3s, color 0.3s;
}
.week-days .day.selected {
	border: 1px solid var(--text-color);
	background: var(--text-color);
	color: var(--bg-dark);
	transition: unset;
}
</style>