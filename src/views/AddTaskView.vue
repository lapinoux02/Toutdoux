<template>
<div id="add-task-view">
	<div class="screen-title">Nouvelle tache</div>
	<div class="add-task-form">
		<div class="form-line"><span class="material-symbols-outlined">task</span><input class="task-input" placeholder="Tache" v-model="newTask.task"></div>
		<div class="form-line">
			<div class="material-symbols-outlined">sell</div>
			<select value="" class="category-select" v-model="newTask.categoryId">
	    	<option value="">Aucune catégorie</option>
				<option v-for="category in categories" :value="category.id">{{category.name}}</option>
			</select>
		</div>
		<div class="form-line"><span class="material-symbols-outlined">event_repeat</span><toggle v-model="newTask.recurrent"></toggle></div>
		<div v-if="!newTask.recurrent" class="form-line"><span class="material-symbols-outlined">event</span><input type="date" class="date-input" v-model="newTask.date"></div>
		<div v-else class="recurence">
			<div v-for="day in days" @click="day.selected ^= 1" class="day" :class="{selected: day.selected}">{{day.name}}</div>
		</div>
		<div class="material-symbols-outlined validate-button" :class="{valid: formValid}" @click="validate">done</div>
	</div>
</div>
</template>
<script>
import { store } from '@/store/store.js'
import Toggle from '@/components/Toggle.vue'
import Multiselect from '@/components/Multiselect.vue'

export default {
	data() {
		return {
			categories: store.categories,
			days: [
				{id: 1, name: 'L', selected: false},
				{id: 2, name: 'M', selected: false},
				{id: 3, name: 'M', selected: false},
				{id: 4, name: 'J', selected: false},
				{id: 5, name: 'V', selected: false},
				{id: 6, name: 'S', selected: false},
				{id: 0, name: 'D', selected: false}
			],
			newTask: {
				id: new Date().getTime(),
				task: undefined,
				categoryId: "",
				date: undefined,
				recurrent: false
			},
			test: undefined
		}
	},
	computed: {
		formValid() {
			return this.newTask.task && (!this.newTask.recurrent || this.days.filter(e => e.selected).length)
		}
	},
	methods: {
		validate() {
			if (!this.formValid) return
			store.addTask({...this.newTask, days: this.days.filter(e => e.selected).map(e => e.id)})
			
			this.$router.push({name: 'backlog'})
		}
	},
	components: {
		Toggle,
		Multiselect
	}
}
</script>
<style scoped>
.add-task-form {
	margin: 0 1rem;
	display: flex;
	flex-direction: column;
	gap: 2rem;
}
.add-task-form .recurence {
	display: flex;
	gap: 1rem;
}
.add-task-form .recurence .day {
	width: 1.5rem;
	height: 1.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 1.5rem;
	border: 1px solid var(--text-color);
	color: var(--text-color);
	font-size: 0.8rem;
}
.add-task-form .date-input {
	width: 100%;
}
.add-task-form .recurence .day.selected {
	border: 1px solid var(--text-color);
	background: var(--text-color);
	color: var(--bg-dark);
}
</style>