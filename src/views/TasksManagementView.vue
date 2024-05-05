
<template>
  <div id="task-management-view">
	  <div class="screen-title">Tasks management</div>
    <div class="category-list">
      <div
        v-for="category in taskCategories"
        class="category-item"
        :class="{selected: category === selectedCategory}"
        :style="{'--color': category.color}"
        @click="toggleSelectedCategory(category)"
      >{{category.name}}</div>
    </div>
    <div class="list">
      <div
        v-for="item in showedItems"
        class="list-item"
        :key="item.id"
        :style="{'--color': categories.find(cat => cat.id === item.categoryId)?.color || 'var(--text-color)'}"
      >
        <div style="display: flex; align-items: center; gap: 1rem;">
          <span class="material-symbols-outlined">{{ itemSymbol(item) }}</span>
          <div class="task-name" @click="expand(item)">{{item.task}}</div>
        </div>
        <div v-if="expandedItem === item" style="display: flex; justify-content: flex-start; align-items: center; padding-left: calc(24px + 1rem); gap: 1rem;">
          <div class="material-symbols-outlined" @click="remove(item)">close</div>
          <div class="material-symbols-outlined" @click="modify(item)">edit</div>
          <div v-if="!item.recurrent" class="material-symbols-outlined" @click="backlogReturn(item)">undo</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store/store.js'
import { notificationStore } from '@/store/notificationStore.js'

export default {
  data() {
    return {
      day: new Date(),
      categories: store.categories,
      draggedItem: undefined,
      selectedCategory: undefined,
      expandedItem: undefined
    }
  },
  computed: {
    list() {
      return store.tasks
    },
    showedItems() {
      if (!this.selectedCategory) return this.list
      return this.list.filter(e => e.categoryId === this.selectedCategory.id)
    },
    taskCategories() {
      return [...this.list.reduce((a, e) => a.add(e.categoryId), new Set())].filter(e => e).map(categoryId => this.categories.find(category => category.id === categoryId))
    }
  },
  methods: {
    itemSymbol(item) {
      switch(item.taskType) {
        case 0: return 'event' + (item.report ? 'replay' : '')
        case 1: return 'date_range' + (item.report ? 'replay' : '')
        case 2: return 'chronic' + (item.report ? 'replay' : '')
        case 3: return 'calendar_month' + (item.report ? 'replay' : '')
      }
    },
    toggleSelectedCategory(category) {
      if (this.selectedCategory === category) {
        this.selectedCategory = undefined
      } else {
        this.selectedCategory = category
      }
    },
    backlogReturn(item) {
      let date = item.date
      item.date = undefined
      store.save()
      notificationStore.notification = {
        item,
        action: 'renvoyé dans le backlog',
        undo: () => {
          item.date = date
          store.save()
        }
      }
    },
    remove(item) {
      let index = store.tasks.indexOf(item)
      store.removeTask(item.id)
      notificationStore.notification = {
        item,
        action: 'supprimé',
        undo: () => {
          store.tasks.splice(index, 0, item)
          store.save()
        }
      }
    },
    report(item) {
      let date = item.date
      item.date = new Date()
      store.save()
      this.expandedItem = undefined
      notificationStore.notification = {
        item,
        action: 'reportée',
        undo: () => {
          item.date = date
          store.save()
        }
      }
    },
    modify(item) {
      if (item.parentTaskId) {
        this.$router.push({name: 'modifyMultiTask', params: {parentTaskId: item.parentTaskId}})
      } else {
        this.$router.push({name: 'modifyTask', params: {taskId: item.id}})
      }
    },
    expand(item) {
      if (this.expandedItem === item) {
        this.expandedItem = undefined
      } else {
        this.expandedItem = item
      }
    }
  }
}

</script>

<style scoped>
#home-view {
  justify-content: stretch;
  align-items: flex-start;
}
#home-view .screen-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  padding-left: 5rem;
  padding-right: 5rem;
}

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
}
.list .list-item {
  color: var(--color);
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80vw;
}
.list .list-item .task-name::first-letter {
  text-transform: uppercase;
}
.list .list-item.done .task-name {
  text-decoration: line-through;
  color: grey;
}
</style>