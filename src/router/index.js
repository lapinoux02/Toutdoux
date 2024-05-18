import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store/store.js'
import HomeView from '/src/views/HomeView.vue'
import NewCategoryView from '/src/views/NewCategoryView.vue'
import CategoriesManagementView from '/src/views/CategoriesManagementView.vue'
import AddTaskView from '/src/views/NewTaskView.vue'
import ModifyTaskView from '/src/views/ModifyTaskView.vue'
import TasksManagementView from '/src/views/TasksManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'home',
    component: HomeView
  }, {
    path: '/tasks-management',
    name: 'tasksManagement',
    component: TasksManagementView
  }, {
    path: '/new-task',
    name: 'newTask',
    component: AddTaskView
  }, {
    path: '/new-category',
    name: 'newCategory',
    component: NewCategoryView
  }, {
    path: '/categories-management',
    name: 'categoriesManagement',
    component: CategoriesManagementView
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
