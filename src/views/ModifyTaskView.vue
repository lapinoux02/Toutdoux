<template>
	<div id="modify-task-view">
		<div class="screen-title">Modifier</div>
		<div class="modify-task-form">
			<input class="task-input" placeholder="Tache" v-model="newTask.task">
			<div style="display: flex; justify-content: stretch; gap: 0.5rem;">
				<select value="" class="category-select" v-model="newTask.categoryId">
		    	<option value="">Aucune catégory</option>
					<option v-for="category in categories" :value="category.id">{{category.name}}</option>
				</select>
				<div class="material-symbols-outlined" @click="$router.push({name: 'newCategory'})">add</div>
			</div>
			<div style="display: flex; align-items: center; gap: 1rem;">Récurrent: <div class="material-symbols-outlined" @click="newTask.recurrent ^= 1">{{newTask.recurrent ? 'check_box' : 'check_box_outline_blank'}}</div></div>
			<input v-if="!newTask.recurrent" type="date" class="date-input" v-model="newTask.date">
			<div v-else class="recurence">
				<div v-for="day in days" @click="day.selected ^= 1" class="day" :class="{selected: day.selected}">{{day.name}}</div>
			</div>
			<div class="material-symbols-outlined validate" :class="{valid: formValid}" @click="validate">done</div>
		</div>
	</div>
</template>
<script>
import { store } from '@/store/store.js'

export default {
	beforeRouteEnter(to, from, next) {
	  next(vm => vm.prevRoute = from)
	},
	props: {
		taskId: null
	},
	data() {
		let task = store.tasks.find(task => task.id == this.taskId)
		return {
			task,
			categories: store.categories,
			newTask: {...task},
			days: [
				{id: 1, name: 'L', selected: false},
				{id: 2, name: 'M', selected: false},
				{id: 3, name: 'M', selected: false},
				{id: 4, name: 'J', selected: false},
				{id: 5, name: 'V', selected: false},
				{id: 6, name: 'S', selected: false},
				{id: 0, name: 'D', selected: false}
			].map(e => ({...e, selected: task.days?.includes(e.id)}))
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

			store.modifyTask(this.task.id, {
				days: this.days.filter(e => e.selected).map(e => e.id),
				categoryId: this.newTask.categoryId,
				recurrent: this.newTask.recurrent,
				date: this.newTask.date,
				task: this.newTask.task
			})
			/*this.task.days = this.days.filter(e => e.selected).map(e => e.id)
			this.task.categoryId = this.newTask.categoryId
			this.task.recurrent = this.newTask.recurrent
			this.task.date = this.newTask.date
			this.task.task = this.newTask.task*/

			if (this.prevRoute) {
				this.$router.push(this.prevRoute)
			} else {
				this.$router.push({name: 'home'})
			}
		}
	}
}
</script>
<style scoped>
.modify-task-form {
	margin: 0 1rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
.modify-task-form .category-select {
	flex-grow: 1;
}
.modify-task-form .recurence {
	display: flex;
	gap: 1rem;
}
.modify-task-form .recurence .day {
	width: 1.5rem;
	height: 1.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 1.5rem;
	border: 1px solid white;
	color: white;
	font-size: 0.8rem;
}
.modify-task-form .date-input {
	width: 100%;
}
.modify-task-form .recurence .day.selected {
	border: 1px solid white;
	background: white;
	color: black;
}
.modify-task-form .validate {
	align-self: center;
	width: 3rem;
	height: 3rem;
	border-radius: 3rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid grey;
	background: transparent;
	color: grey;
}
.modify-task-form .validate.valid {
	background: black;
	border: 1px solid white;
	color: white;
}
</style>