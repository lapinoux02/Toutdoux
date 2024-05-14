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
</style>