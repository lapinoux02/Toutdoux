<template>
  <div v-if="notification" class="notification-holder">
  	<div class="notification">
  		<div><span :style="{color: itemColor(notification.item)}">{{notification.item.task}}</span> {{notification.action}}</div><div @click="notification.undo()" class="undo">undo</div>
  	</div>
  </div>
</template>
<script>
import { store } from '@/store/store.js'

export default {
  props: {
    notification: null
  },
	data() {
		return {
      categories: store.categories
		}
	},
  methods: {
  	itemColor(item) {
  		return this.categories.find(cat => cat.id === item.categoryId)?.color || 'white'
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
	background: black;
	border-radius: 5rem;
	font-size: 0.7rem;
	padding: 0.2rem 0.6rem;
	gap: 0.8rem;
}
.notification-holder .notification .undo {
	color: #e3e304;
}
</style>