import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store/store.js'
import HomeView from '/src/views/HomeView.vue'
import BacklogView from '/src/views/BacklogView.vue'
import AddTaskView from '/src/views/AddTaskView.vue'
import NewCategoryView from '/src/views/NewCategoryView.vue'
import ModifyTaskView from '/src/views/ModifyTaskView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'home',
    component: HomeView
  }, {
    path: '/backlog',
    name: 'backlog',
    component: BacklogView
  }, {
    path: '/new-task',
    name: 'newTask',
    component: AddTaskView
  }, {
    path: '/new-category',
    name: 'newCategory',
    component: NewCategoryView
  }, {
    path: '/modify-task/:taskId',
    name: 'modifyTask',
    component: ModifyTaskView,
    props: true
  }]
})

router.beforeEach((to, from) => {
  if (!store.tasks?.length && !store.categories?.length) {
    store.load()
  }
  return true
})

export default router
