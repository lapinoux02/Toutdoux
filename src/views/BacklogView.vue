<template>
<div id="backlog-view">
	<div class="screen-title">Non attribuées</div>
  <div class="category-list">
    <div
      v-for="category in taskCategories"
      class="category-item"
      :class="{selected: category === selectedCategory}"
      :style="{'--color': category.color}"
      @touchstart="toggleSelectedCategory(category)"
    >{{category.name}}</div>
  </div>
  <div class="list">
    <div
      v-for="item in showedItems"
      class="list-item"
      :key="item.id"
      draggable="true"
      dropable="true"
      @dragstart="startDrag(item)"
      @dragover="dragOver(item)"
      @dragend="endDrag"
      :style="{'--color': itemColor(item)}"
    >
      <div draggable="false" class="task-name">{{item.task}}</div>
    </div>
  </div>
  <div class="days">
  	<div v-for="day in days"
  		:key="day.date"
  		class="day"
  		dropable="true"
  		@dragover.prevent
  		@drop="scheduleItem(day)"
      @click="$router.push({name: 'home'})"
  	>{{day.name}}</div>
  </div>
</div>
</template>
<script>
import { store } from '@/store/store.js'
import { notificationStore } from '@/store/notificationStore.js'
import { addDays, format } from 'date-fns'

export default {
	data() {
		return {
      categories: store.categories,
			draggedItem: undefined,
      selectedCategory: undefined,
      days: [{
      	date: new Date(),
      	name: 'Aujourd\'hui'
      }, {
      	date: addDays(new Date(), 1),
      	name: format(addDays(new Date(), 1), 'dd/MM')
      }, {
      	date: addDays(new Date(), 2),
      	name: format(addDays(new Date(), 2), 'dd/MM')
      }, {
      	date: addDays(new Date(), 3),
      	name: format(addDays(new Date(), 3), 'dd/MM')
      }]
		}
	},
  computed: {
    showedItems() {
      if (!this.selectedCategory) return this.list
      return this.list.filter(e => e.categoryId === this.selectedCategory.id)
    },
    taskCategories() {
      return [...this.list.reduce((a, e) => a.add(e.categoryId), new Set())].filter(e => e).map(categoryId => this.categories.find(category => category.id === categoryId))
    },
    list() {
    	return store.tasks.filter(task => !task.date && !task.recurrent)
    }
  },
  methods: {
  	itemColor(item) {
  		return this.categories.find(cat => cat.id === item.categoryId)?.color || 'var(--text-color)'
  	},
    startDrag(item) {
      this.draggedItem = item
    },
    endDrag() {
      this.draggedItem = undefined
    },
    dragOver(item) {
      if (item === this.draggedItem) return

      store.tasks.splice(store.tasks.indexOf(item), 0, ...store.tasks.splice(store.tasks.indexOf(this.draggedItem), 1))
    },
    toggleSelectedCategory(category) {
      if (this.selectedCategory === category) {
        this.selectedCategory = undefined
      } else {
        this.selectedCategory = category
      }
    },
    scheduleItem(day) {
      store.scheduleItem(this.draggedItem.id, day.date)
    	let item = this.draggedItem
    	notificationStore.notification = {
    		item,
        action: `prévu pour ${day.name}`,
    		undo: () => {
    			item.date = undefined
    		}
    	}
    }
  }
}
</script>
<style scoped>
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0 0 1rem 1rem;
}
.category-list .category-item {
  /* --color variable is defined directly in the element style, in the template */
  font-size: 0.8rem;
  border: 1px solid var(--color);
  color: var(--color);
  border-radius: 2rem;
  padding: 0 0.5rem;
}
.category-list .category-item.selected {
  /* --color variable is defined directly in the element style, in the template */
  border: 1px solid var(--color);
  background: var(--color);
  color: #303841;
}

.list {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: auto;
  gap: 0.3rem;
  position: relative;
}
.list .button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}
.list .list-item {
  color: var(--color);
  margin-left: 1rem;
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  align-items: center;
  width: 80vw;
}
.list .list-item .task-name::first-letter {
  text-transform: uppercase;
}
.list .list-item .drag-indicator {
  color: grey;
}

.days {
  border-top: 5px solid var(--bg-dark);
  height: 15rem;
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding: 1rem;
}
.days .day {
	width: 10rem;
	height: 5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #7a7476;
	border-radius: 0.5rem;
}
</style>