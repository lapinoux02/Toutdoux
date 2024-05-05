<template>
<div id="multi-task-view">
	<div class="screen-title">Modifier tache multiple</div>
	<div class="add-multi-task-form">
		<div class="form-line"><span class="material-symbols-outlined">task</span><input class="task-input" placeholder="Tache" v-model="newTask.task"></div>
		<div class="form-line">
			<div class="material-symbols-outlined">sell</div>
			<select value="" class="category-select" v-model="newTask.categoryId">
	    	<option value="">Aucune catégorie</option>
				<option v-for="category in categories" :value="category.id">{{category.name}}</option>
			</select>
		</div>
		<div v-if="!newTask.recurrent" class="form-line"><span class="material-symbols-outlined">event</span><input type="date" class="date-input" v-model="newTask.date"></div>
		<div class="sub-tasks">
			<div v-for="(subTask, i) in subTasks" :key="i" class="form-line"><div class="material-symbols-outlined">label</div><input placeholder="Sous-tache" v-model="subTask.name"><div class="material-symbols-outlined" @click="removeSubTask(i)">close</div></div>
			<div class="material-symbols-outlined" style="align-self: flex-start;" @click="addSubTask">new_label</div>
		</div>
		<div class="material-symbols-outlined validate-button" :class="{valid: formValid}" @click="validate">done</div>
	</div>
</div>
</template>
<script>
import { store } from '@/store/store.js'

export default {
	props: {
		parentTaskId: null
	},
	data() {
		let tasks = store.tasks.filter(task => task.parentTaskId == this.parentTaskId)
		return {
			categories: store.categories,
			newTask: {
				id: this.parentTaskId,
				task: tasks[0].parentTask,
				categoryId: tasks[0].categoryId,
				date: tasks[0].date
			},
			subTasks: [...tasks.map(task => ({name: task.subTask, id: task.id}))]
		}
	},
	computed: {
		formValid() {
			return this.newTask.task && this.subTasks.filter(subTask => subTask.name).length
		}
	},
	methods: {
		addSubTask() {
			this.subTasks.push({name: '', id: new Date().getTime()})
		},
		removeSubTask(i) {
			this.subTasks.splice(i, 1)
		},
		validate() {
			if (!this.formValid) return
			store.tasks.filter(task => task.parentTaskId == this.parentTaskId).forEach(task => store.removeTask(task.id))
			this.subTasks.filter(subTask => subTask.name).forEach(subTask => store.addTask({
				id: subTask.id,
				parentTaskId: this.newTask.id,
				parentTask: this.newTask.task,
				task: `${this.newTask.task}: ${subTask.name}`,
				subTask: subTask.name,
				categoryId: this.newTask.categoryId,
				date: this.newTask.date
			}))
			
			this.$router.push({name: 'backlog'})
		}
	}
}
</script>
<style scoped>
.add-multi-task-form {
	margin: 0 1rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
.add-multi-task-form .category-select {
	flex-grow: 1;
}
.add-multi-task-form .date-input {
	width: 100%;
}
.add-multi-task-form .sub-tasks {
	display: flex;
	flex-direction: column;
}
</style>