import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store/store.js'
import HomeView from '/src/views/HomeView.vue'
import BacklogView from '/src/views/BacklogView.vue'
import AddTaskView from '/src/views/NewTaskView.vue'
import NewMultiTaskView from '/src/views/NewMultiTaskView.vue'
import NewCategoryView from '/src/views/NewCategoryView.vue'
import ModifyTaskView from '/src/views/ModifyTaskView.vue'
import ModifyMultiTaskView from '/src/views/ModifyMultiTaskView.vue'
import TasksManagementView from '/src/views/TasksManagementView.vue'

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
    path: '/tasks-management',
    name: 'tasksManagement',
    component: TasksManagementView
  }, {
    path: '/new-task',
    name: 'newTask',
    component: AddTaskView
  }, {
    path: '/new-multi-task',
    name: 'newMultiTask',
    component: NewMultiTaskView
  }, {
    path: '/new-category',
    name: 'newCategory',
    component: NewCategoryView
  }, {
    path: '/modify-task/:taskId',
    name: 'modifyTask',
    component: ModifyTaskView,
    props: true
  }, {
    path: '/modify-multi-task/:parentTaskId',
    name: 'modifyMultiTask',
    component: ModifyMultiTaskView,
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
