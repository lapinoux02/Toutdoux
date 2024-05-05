import { reactive } from 'vue'
import { SimpleTask, RepeatingTask, WeeklyTask, MonthlyTask, MonthlyWeekDayTask } from '@/models/Task.js'

export const store = reactive({
  categories: [],
  tasks: [],
  getTask(taskId) {
    return this.tasks.find(task => task.id === taskId)
  },
  addTask(task) {
    this.tasks.push(task)
    this.save()
  },
  removeTask(taskId) {
    this.tasks.splice(this.tasks.findIndex(task => task.id == taskId), 1)
    this.save()
  },
  modifyTask(taskId, newTask) {
    this.tasks.splice(this.tasks.findIndex(task => task.id == taskId), 1, newTask)
    this.save()
  },
  addCategory(category) {
    this.categories.push(category)
    this.save()
  },
  scheduleItem(taskId, date) {
     this.tasks.find(task => task.id == taskId).date = date
     this.save()
  },
  save() {
    localStorage.setItem('todo', JSON.stringify({categories: this.categories, tasks: this.tasks}))
  },
  load() {
    let storage = JSON.parse(localStorage.getItem('todo'))
    if (!storage) return

    this.categories = storage.categories
    // this.tasks = storage.tasks
    storage.tasks.forEach(task => {
      switch(task.taskType) {
        case 0:
          var newTask = new SimpleTask(task)
          break
        case 1:
          newTask = new WeeklyTask(task)
          break
        case 2:
          newTask = new RepeatingTask(task)
          break
        case 3:
          switch(task.monthType) {
          case 0:
            newTask = new MonthlyTask(task)
            break
          case 1:
            newTask = new MonthlyWeekDayTask(task)
            break
          }
      }
      this.tasks.push(newTask)
    })
  }
})