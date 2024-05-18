
<template>
  <div id="task-management-view">
	  <div class="screen-title">Categories management</div>
    <div class="list">
      <div
        v-for="category in categories"
        class="list-item"
        :class="{expanded: expandedItem === category}"
        :key="category.id"
        :style="{'--color': category.color}"
      >
        <div style="display: flex; align-items: center; gap: 1rem;">
          <span class="material-symbols-outlined">label</span>
          <div class="task-name" @click="expand(category)">{{category.name}}</div>
        </div>
        <div v-if="expandedItem === category" class="list-item-actions">
          <div class="material-symbols-outlined" @click="remove(category)">delete</div>
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
      categories: store.categories,
      expandedItem: undefined
    }
  },
  methods: {
    remove(category) {
      store.removeCategory(category.id)
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
  &.expanded {
    box-shadow: 0 0 5px var(--bg-dark);
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
</style>