
<template>
  <div id="home-view">
    <div class="screen-title">{{dayLabel}}</div>
    <div v-if="taskCategories.length" class="category-list">
      <div
        v-for="category in taskCategories"
        class="category-item"
        :class="{selected: category === selectedCategory}"
        :style="{'--color': category.color}"
        @click="toggleSelectedCategory(category)"
      >{{category.name}}</div>
    </div>
    <div class="list" v-touch:swipe.left="addDay" v-touch:swipe.right="subDay" @click.self="expand(undefined)">
      <div
        v-for="item in showedItems"
        class="list-item"
        :key="item.id"
        draggable="true"
        dropable="true"
        @dragstart="startDrag(item)"
        @dragover="dragOver(item)"
        @dragend="endDrag"
        :class="{done: item.isDone(day), expanded: expandedItem === item}"
        :style="{'--color': categories.find(cat => cat.id === item.categoryId)?.color || 'var(--text-color)'}"
      >
        <div class="list-item-task">
          <div class="material-symbols-outlined check-box" @click.self="checkClick(item)">{{item.isDone(day) ? 'check_box' : 'check_box_outline_blank'}}</div>
          <div class="task-name" @click="expand(item)">{{item.task}}</div>
        </div>
        <div v-if="expandedItem === item" class="list-item-actions">
          <div class="material-symbols-outlined" @click="remove(item)">delete</div>
          <div class="material-symbols-outlined" @click="modify(item)">edit</div>
          <div v-if="!isSameDay(new Date(), day) && !item.isDone(day)" class="material-symbols-outlined" @click="report(item)">replay</div>
        </div>
      </div>
    </div>
    <calendar class="home-view-calendar" v-model="day"></calendar>
  </div>
</template>

<script>
import Calendar from '@/components/Calendar.vue'
import { store } from '@/store/store.js'
import { notificationStore } from '@/store/notificationStore.js'
import { isSameDay, subDays, addDays, format } from 'date-fns'
import { rightLeft } from '@/utils/keyboardEvents.js'

export default {
  data() {
    return {
      day: new Date(),
      categories: store.categories,
      draggedItem: undefined,
      selectedCategory: undefined,
      expandedItem: undefined,
      keyboardEventListener: rightLeft(this.addDay, this.subDay)
    }
  },
  computed: {
    dayLabel() {
      let dayLabel = format(this.day, 'dd EEE MM')
      if (isSameDay(new Date(), this.day)) dayLabel += ' (today)'
      
      return dayLabel
    },
    list() {
      return store.tasks.filter(task => task.display(this.day))
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
    isSameDay,
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
    checkClick(item) {
      item.toggleDone(this.day)
      store.save()
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
    },
    subDay() {
      this.day = subDays(this.day, 1)
    },
    addDay() {
      this.day = addDays(this.day, 1)
    }
  },
  mounted() {
    document.addEventListener('keyup', this.keyboardEventListener)
  },
  unmounted() {
    document.removeEventListener('keyup', this.keyboardEventListener)
  },
  components: {
    Calendar
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
  justify-content: center;
  width: 100vw;
  padding-left: 5rem;
  padding-right: 5rem;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0 1rem 1rem 1rem;
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
  width: 100%;
  padding-top: 2px;
}
.list .list-item {
  position: relative;
  color: var(--color);
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: stretch;
  width: 100vw;
  &.expanded {
    box-shadow: 0 0 5px var(--bg-dark);
  }
  .list-item-task {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    .task-name {
      flex-grow: 1;
    }
  }
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
.list .list-item.done .task-name {
  text-decoration: line-through;
  color: grey;
}
.home-view-calendar {
  flex-shrink: 0;
}
</style>