import { reactive } from 'vue'
import { format } from 'date-fns'

export const store = reactive({
  categories: [],
  tasks: [],
/*  categories: [{
    name: 'Garage',
    color: '#f5428a',
    id: 3
  }, {
    name: 'Maison',
    color: '#eb9b34',
    id: 1
  }, {
    name: 'Bien-être',
    color: '#56d65a',
    id: 2
  }],
  tasks: [
    {task: 'vaisselle', id: 0, categoryId: 1, date: format(new Date(), 'yyyy-MM-dd')},
    {task: 'arroser les plantes', id: 1, categoryId: 1, date: format(new Date(), 'yyyy-MM-dd')},
    {task: 'yoga', id: 2, categoryId: 2, date: format(new Date(), 'yyyy-MM-dd')},
    {task: 'révision voiture', id: 3, categoryId: 3},
    {task: 'vendre cartons', id: 4, categoryId: 3},
    {task: 'préparer risoto', id: 5, categoryId: 1},
    {task: 'poster faire-parts', id: 6, date: format(new Date(), 'yyyy-MM-dd')},
    {task: 'sortir poubelles', id: 7}
  ],*/
  addTask(task) {
    this.tasks.push(task)
    this.save()
  },
  modifyTask(taskId, newTask) {
    this.tasks.splice(this.tasks.findIndex(task => task.id === taskId), 1, newTask)
    this.save()
  },
  addCategory(category) {
    this.categories.push(category)
    this.save()
  },
  save() {
    localStorage.setItem('todo', JSON.stringify({categories: this.categories, tasks: this.tasks}))
  },
  load() {
    let storage = JSON.parse(localStorage.getItem('todo'))
    if (!storage) return

    this.categories = storage.categories
    this.tasks = storage.tasks
  }
})