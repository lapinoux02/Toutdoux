<template>
  <div v-if="notification" class="notification-holder">
  	<div class="notification">
  		<div><span :style="{color: itemColor(notification.item)}">{{notification.item.task}}</span> {{notification.action}}</div><div @click="undo" class="undo">undo</div>
  	</div>
  </div>
</template>
<script>
import { store } from '@/store/store.js'
import { notificationStore } from '@/store/notificationStore.js'

export default {
	data() {
		return {
      categories: store.categories,
			timeout: undefined
		}
	},
	watch: {
		notification(newNotification) {
			if (newNotification) {
				clearTimeout(this.timeout)
				setTimeout(() => {
					notificationStore.notification = undefined
				}, 5000)
			}
		}
	},
	computed: {
		notification() {
			return notificationStore.notification
		}
	},
  methods: {
  	itemColor(item) {
  		return this.categories.find(cat => cat.id === item.categoryId)?.color || 'var(--text-color)'
  	},
		undo() {
			this.notification.undo()
			notificationStore.notification = undefined
			clearTimeout(this.timeout)
		}
  }
}
</script>
<style scoped>
.notification-holder {
	position: fixed;
	margin: auto;
	bottom: 0.5rem;
	width: 100vw;
	display: flex;
	justify-content: center;
	z-index: 11;
}
.notification-holder .notification {
	display: flex;
	background: var(--bg-darker);
	border-radius: 5rem;
	font-size: 0.7rem;
	padding: 0.2rem 0.6rem;
	gap: 0.8rem;
}
.notification-holder .notification .undo {
	color: #e3e304;
}
</style>