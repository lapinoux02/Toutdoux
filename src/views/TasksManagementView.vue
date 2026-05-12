
<template>
  <div id="task-management-view">
	  <div class="screen-title">Tasks management</div>
    <div class="category-list" v-if="taskCategories?.length">
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
        <div class="list-item-actions">
          <div class="material-symbols-outlined" @click="remove(item)">delete</div>
          <div class="material-symbols-outlined" @click="modify(item)">edit</div>
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
      selectedCategory: undefined
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
        case 0: return 'event'
        case 1: return 'date_range'
        case 2: return 'chronic'
        case 3: return 'calendar_month'
      }
    },
    toggleSelectedCategory(category) {
      if (this.selectedCategory === category) {
        this.selectedCategory = undefined
      } else {
        this.selectedCategory = category
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
    modify(item) {
      this.$router.push({name: 'modifyTask', params: {taskId: item.id}})
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
  padding-top: 2px;
}
.list .list-item {
  position: relative;
  color: var(--color);
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100vw;
  .list-item-actions {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    position: absolute;
    bottom: 0;
    top: 0;
    background: var(--bg-light);
    padding: 4px 1em;
    right: 10px;
    z-index: 1;
    color: var(--text-color);
  }
}
</style>