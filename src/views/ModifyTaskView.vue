<template>
<div id="modify-task-view">
	<div class="screen-title">Modifier</div>
	<task-form :modelValue="task" @update:modelValue="updateTask"></task-form>
</div>
</template>
<script>
import { store } from '@/store/store.js'
import { notificationStore } from '@/store/notificationStore.js'
import TaskForm from '@/components/TaskForm.vue'

export default {
	props: {
		taskId: null
	},
	data() {
		return {
			task: store.getTask(this.taskId),
		}
	},
	methods: {
		updateTask(task) {
			store.modifyTask(this.taskId, task)
      notificationStore.notification = {
        item: task,
        action: 'modified',
        undo: () => {
					store.modifyTask(this.taskId, this.task)
        }
      }
		}
	},
	components: {
		TaskForm
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
	border: 1px solid var(--text-color);
	color: var(--text-color);
	font-size: 0.8rem;
}
.modify-task-form .date-input {
	width: 100%;
}
.modify-task-form .recurence .day.selected {
	border: 1px solid var(--text-color);
	background: var(--text-color);
	color: var(--bg-dark);
}
</style>