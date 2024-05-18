<template>
  <div class="task-form">
    <div class="form-line"><span class="material-symbols-outlined">task</span><input placeholder="Tache" v-model="task"></div>
    <div class="form-line"><div class="material-symbols-outlined">sell</div><select v-model="categoryId"><option value="">Aucune catégorie</option><option v-for="category in categories" :value="category.id">{{category.name}}</option></select></div>
    <div class="form-line"><span class="material-symbols-outlined">event_repeat</span><toggle v-model="report"></toggle></div>
    <multiselect v-model="taskType" :options="taskTypes" style="font-size: 0.6em"></multiselect>
    <template v-if="taskType.id === 0">
      <div class="form-line"><span class="material-symbols-outlined">event</span><input type="date" v-model="date"></div>
    </template>
    <template v-if="taskType.id === 1">
      <div class="form-line"><span class="material-symbols-outlined">event</span><input type="date" v-model="date"></div>
      <week-days v-model="weekDays" style="font-size: 0.6em"></week-days>
    </template>
    <template v-if="taskType.id === 2">
      <div class="form-line"><span class="material-symbols-outlined">event</span><input type="date" v-model="date"></div>
      <div class="form-line"><span class="material-symbols-outlined">chronic</span><input type="number" v-model="periodSpan"></div>
    </template>
    <template v-if="taskType.id === 3">
      <multiselect v-model="monthType" :options="monthTypes" style="font-size: 0.6em"></multiselect>
      <div class="form-line"><span class="material-symbols-outlined">calendar_month</span><input type="month" v-model="monthDate"></div>
      <template v-if="monthType.id === 0">
        <div class="form-line"><span class="material-symbols-outlined">today</span><input type="number" v-model="dayOfMonth"></div>
      </template>
      <template v-if="monthType.id === 1">
        <multiselect v-model="weekNumber" :options="weekNumbers" style="font-size: 0.6em"></multiselect>
        <week-day v-model="weekDay" style="font-size: 0.6em"></week-day>
      </template>
    </template>
    <div class="material-symbols-outlined validate-button" :class="{valid: formValid}" @click="validate">done</div>
  </div>
</template>
<script>
import { store } from '@/store/store.js'
import Multiselect from '@/components/Multiselect.vue'
import { format } from 'date-fns'
import WeekDays from '@/components/WeekDays.vue'
import WeekDay from '@/components/WeekDay.vue'
import Toggle from '@/components/Toggle.vue'
import { SimpleTask, RepeatingTask, WeeklyTask, MonthlyTask, MonthlyWeekDayTask } from '@/models/Task.js'

export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: null,
  },
  data() {
    let taskTypes = [{id: 0, label: 'Simple', icon: 'event'}, {id: 2, label: 'Périodique', icon: 'chronic'}, {id: 1, label: 'Hebdo', icon: 'date_range'}, {id: 3, label: 'Mensuel', icon: 'calendar_month'}]
    let monthTypes = [{id: 0, label: 'Daté'}, {id: 1, label: 'Glissé'}]
    let weekNumbers = [{id: 0, label: '1er'}, {id: 1, label: '2eme'}, {id: 2, label: '3eme'}, {id: 3, label: '4eme'}]

    return {
      categories: store.categories,
      taskTypes,
      monthTypes,
      weekNumbers,

      task: this.modelValue?.task ?? '',
      categoryId: this.modelValue?.categoryId ?? '',
      date: format(this.modelValue?.date ?? new Date(), 'y-MM-dd'),
      report: this.modelValue?.report ?? false,
      taskType: this.modelValue?.taskType ? taskTypes.find(taskType => taskType.id === this.modelValue.taskType) : taskTypes[0],
      // Simple (empty)
      // Weekly
      weekDays: this.modelValue?.weekDays ?? [],
      // Repeating
      periodSpan: this.modelValue?.periodSpan ?? 1,
      // MonthlyTasks
      monthType: monthTypes[this.modelValue?.monthType ?? 0],
      monthDate: format(this.modelValue?.monthDate ?? new Date(), 'y-MM'),
      // Monthly
      dayOfMonth: this.modelValue?.dayOfMonth ?? 1,
      // MonthlyWeekDay
      weekNumber: weekNumbers[this.modelValue?.weekNumber ?? 0],
      weekDay: this.modelValue?.weekDay ?? 1
    }
  },
  computed: {
    formValid() {
      if (!this.task) return false

      switch(this.taskType.id) {
      case 0:
        return true
      case 1:
        return this.weekDays.length && this.date
      case 2:
        return this.date && this.periodSpan > 0
      case 3:
        switch(this.monthType.id) {
        case 0:
          return this.monthDate && this.dayOfMonth > 0 && this.dayOfMonth < 29
        case 1:
          return this.monthDate && this.weekNumber && this.weekDay != null
        }
      }
    }
  },
  methods: {
    validate() {
      if (!this.formValid) return

      let data = {
        task: this.task,
        categoryId: this.categoryId,
        report: this.report,
        taskType: this.taskType.id,
        date: new Date(this.date),
        weekDays: this.weekDays.map(e => e.id),
        periodSpan: this.periodSpan,
        monthType: this.monthType.id,
        monthDate: new Date(this.monthDate),
        dayOfMonth: this.dayOfMonth,
        weekNumber: this.weekNumber.id,
        weekDay: this.weekDay
      }

      switch(this.taskType.id) {
      case 0:
        var newTask = new SimpleTask(data)
        break
      case 1:
        newTask = new WeeklyTask(data)
        break
      case 2:
        newTask = new RepeatingTask(data)
        break
      case 3:
        switch(this.monthType.id) {
        case 0:
          newTask = new MonthlyTask(data)
          break
        case 1:
          newTask = new MonthlyWeekDayTask(data)
          break
        }
      }

      this.$emit('update:modelValue', newTask)

      this.task = '',
      this.categoryId = '',
      this.date = format(new Date(), 'y-MM-dd'),
      this.report = false,
      this.taskType = this.taskTypes[0],
      this.weekDays = [],
      this.periodSpan = 1,
      this.monthType = this.monthTypes[0],
      this.monthDate = format(new Date(), 'y-MM'),
      this.dayOfMonth = 1,
      this.weekNumber = this.weekNumbers[0],
      this.weekDay = 1
    }
  },
  components: {
    Multiselect,
    WeekDays,
    WeekDay,
    Toggle
  }
}
</script>
<style scoped>
.task-form {
  margin: 1rem 1rem 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
  padding-bottom: 1em;
  > * {
    flex-shrink: 0;
  }
}
</style>