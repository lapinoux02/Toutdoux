
<template>
  <div id="home-view">
    <div class="screen-title">
      <div class="nav-arrow material-symbols-outlined" @click="subDay">chevron_left</div>
      {{title}}
      <div class="nav-arrow material-symbols-outlined" @click="addDay">chevron_right</div>
    </div>
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
        draggable="true"
        dropable="true"
        @dragstart="startDrag(item)"
        @dragover="dragOver(item)"
        @dragend="endDrag"
        :class="{done: item.done}"
        :style="{'--color': categories.find(cat => cat.id === item.categoryId)?.color || 'white'}"
      >
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div class="material-symbols-outlined check-box" @click="item.done ^= 1">{{item.done ? 'check_box' : 'check_box_outline_blank'}}</div>
          <div class="task-name" @click="expand(item)">{{item.task}}</div>
        </div>
        <div v-if="expandedItem === item" style="display: flex; justify-content: flex-start; align-items: center; padding-left: calc(24px + 1rem); gap: 1rem;">
          <div class="material-symbols-outlined" @click="remove(item)">close</div>
          <div class="material-symbols-outlined" @click="modify(item)">edit</div>
          <div v-if="!item.recurrent" class="material-symbols-outlined" @click="backlogReturn(item)">undo</div>
        </div>
      </div>
    </div>
    <overlay>
      <template #bottom-left><div class="material-symbols-outlined" @click="$router.push({name: 'backlog'})">database</div></template>
    </overlay>
    <notification :notification="notification"></notification>
  </div>
</template>

<script>
import Overlay from '@/components/Overlay.vue'
import Notification from '@/components/Notification.vue'
import { store } from '@/store/store.js'
import { isSameDay, subDays, addDays, format } from 'date-fns'

export default {
  data() {
    return {
      day: new Date(),
      categories: store.categories,
      draggedItem: undefined,
      selectedCategory: undefined,
      notification: undefined,
      expandedItem: undefined
    }
  },
  computed: {
    title() {
      if (isSameDay(new Date(), this.day)) return 'AUJOURD\'HUI'
      else return format(this.day, 'dd EEE MM')
    },
    list() {
      return store.tasks.filter(task => {
        if (task.recurrent) {
          return task.days.includes(this.day.getDay())
        } else {
          return isSameDay(new Date(task.date), this.day)
        }
      })
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
    backlogReturn(item) {
      let date = item.date
      item.date = undefined
      this.notification = {
        item,
        action: 'renvoyé dans le backlog',
        undo: () => {
          item.date = date
          clearTimeout(timeout)
          this.notification = undefined
        }
      }
      var timeout = setTimeout(() => this.notification = undefined, 5000)
    },
    remove(item) {
      let index = store.tasks.indexOf(item)
      store.tasks.splice(index, 1)
      this.notification = {
        item,
        action: 'supprimé',
        undo: () => {
          store.tasks.splice(index, 0, item)
          clearTimeout(timeout)
          this.notification = undefined
        }
      }
      var timeout = setTimeout(() => this.notification = undefined, 5000)
    },
    modify(item) {
      this.$router.push({name: 'modifyTask', params: {taskId: item.id}})
    },
    expand(item) {
      if (this.expandedItem === item) {
        this.expandedItem = undefined
      } else {
        this.expandedItem = item
      }
    },
    subDay() {
      this.day = subDays(this.day, 1)
    },
    addDay() {
      this.day = addDays(this.day, 1)
    }
  },
  components: {
    Overlay,
    Notification
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
.list .list-item .drag-indicator {
  color: grey;
}
</style>