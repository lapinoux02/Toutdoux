<template>
  <div class="calendar-holder">
    <div class="calendar" ref="calendar">
      <div v-for="dayTasks in daysTasks"
        class="calendar-day"
        :class="{'current-day': this.modelValue.getTime() === dayTasks.day.getTime()}"
        @click="this.onDayClick(dayTasks.day)"
      >
        {{ format(dayTasks.day, 'dd/MM') }}
        <div v-for="task in dayTasks.tasks"
          class="calendar-day-task"
          :style="{'--color': itemColor(task)}"
        >
          {{ task.task }}
        </div>
        <div v-if="dayTasks.more">+ {{ dayTasks.more }} more</div>
      </div>
    </div>
    <div v-if="showRefocus" class="material-symbols-outlined refocus" @click="refocus">point_scan</div>
  </div>
</template>
<script>
import { addDays, subDays, format } from 'date-fns'
import { store } from '@/store/store.js'
import { nextTick } from 'vue'

export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: null
  },
  data() {
    const days = [this.modelValue]
    for (let i = 1; i < 8; days.push(addDays(this.modelValue, i++)));

    return {
      days,
      infiniteScrollObs: undefined,
      currentDayObs: undefined,
      showRefocus: false
    }
  },
  computed: {
    categories() {
      return store.categories
    },
    daysTasks() {
      return this.days.map(day => {
        const tasks = this.getTasks(day)
        if (tasks.length > 3) {
          var displayedTasks = tasks.slice(0, 2)
          var more = tasks.length - 2
        } else {
          displayedTasks = tasks
        }
        return {
          day,
          tasks: displayedTasks,
          more
        }
      })
    }
  },
  methods: {
    format,
    getTasks(day) {
      return store.tasks.filter(task => !task.isDone(day) && task.display(day))
    },
  	itemColor(task) {
  		return this.categories.find(cat => cat.id === task.categoryId)?.color || 'var(--text-color)'
  	},
    refocus() {
      document.querySelector('.current-day').scrollIntoView({inline: 'start', behavior: 'smooth'})
    },
    async onDayClick(day) {
      this.$emit('update:modelValue', day)
      await nextTick()
      this.changeCurrentDayObs()
    },
    changeCurrentDayObs() {
      if (this.currentDayObs) this.currentDayObs.disconnect()
      
      let currentDay = document.querySelector('.current-day')
      this.currentDayObs = new IntersectionObserver(entries => {
        let entry = entries.find(entry => entry.target === currentDay)
        if (entry) {
          this.showRefocus = !entry.isIntersecting
        }
      }, {root: this.$refs.calendar})
      this.currentDayObs.observe(currentDay)
    }
  },
  mounted() {
    let lastChild = this.$el.querySelector('.calendar-day:last-child')
    let firstChild = this.$el.querySelector('.calendar-day:first-child')

    this.infiniteScrollObs = new IntersectionObserver(entries => {
      entries.forEach(async entry => {
        if (entry.target === lastChild && entry.isIntersecting) {
          let lastDay = this.days.at(-1)
          for (let i = 1; i < 5; this.days.push(addDays(lastDay, i++)));

          this.infiniteScrollObs.unobserve(lastChild)
          lastChild = this.$el.querySelector('.calendar-day:last-child')
          this.infiniteScrollObs.observe(lastChild)
        } else if (entry.target === firstChild && entry.isIntersecting) {
          const calendar = this.$refs.calendar
          
          let scrollDiff = calendar.scrollWidth - calendar.scrollLeft
          let firstDay = this.days[0]
          for (let i = 1; i < 5; this.days.unshift(subDays(firstDay, i++)));
          await nextTick()
          calendar.scrollLeft = calendar.scrollWidth - scrollDiff

          this.infiniteScrollObs.unobserve(firstChild)
          firstChild = this.$el.querySelector('.calendar-day:first-child')
          this.infiniteScrollObs.observe(firstChild)
        }
        this.changeCurrentDayObs()
      })
    }, {root: this.$refs.calendar})

    this.infiniteScrollObs.observe(lastChild)
    this.infiniteScrollObs.observe(firstChild)

    this.changeCurrentDayObs()

    document.querySelector('.current-day').scrollIntoView()
  },
  unmounted() {
    this.currentDayObs.disconnect()
    this.infiniteScrollObs.disconnect()
  }
}
</script>
<style>
.calendar-holder {
  position: relative;
  width: 100vw;
}
.calendar {
  height: 100px;
  width: 100vw;
  display: flex;
  font-size: 0.6em;
  gap: 1px;
  margin-top: 0.3em;
  overflow-x: auto;
  .calendar-day {
    flex-shrink: 0;
    box-sizing: border-box;
    width: 90px;
    border: 2px solid var(--bg-dark);
    border-radius: 5px;
    height: 100%;
    background: var(--bg-dark);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 0 0.5em;
    &.current-day {
      border-color: var(--text-color);
    }
    .calendar-day-task {
      align-self: flex-start;
      box-sizing: border-box;
      max-width: 100%;
      background: var(--color);
      color: var(--bg-dark);
      border-radius: 999px;
      padding: 0 0.5em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.refocus {
  position: absolute;
  top: -34px;
  padding: 3px;
  background: var(--bg-darker);
  border-radius: 999px;
  left: calc(50vw - 15px);
}
</style>