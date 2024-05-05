<template>
<div id="new-task-view">
	<div class="screen-title">Nouvelle tache</div>
	<task-form @update:modelValue="storeTask"></task-form>
</div>
</template>
<script>
import { store } from '@/store/store.js'
import { notificationStore } from '@/store/notificationStore.js'
import TaskForm from '@/components/TaskForm.vue'

export default {
	methods: {
		storeTask(task) {
			store.addTask(task)
      notificationStore.notification = {
        item: task,
        action: 'created',
        undo: () => {
					store.removeTask(task.id)
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
.new-task-form {
  margin: 1rem 1rem 0 1rem;
	display: flex;
	flex-direction: column;
	gap: 2rem;
}
</style>