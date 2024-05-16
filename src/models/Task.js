import { isSameDay, isToday, isAfter, differenceInDays, subDays, addDays, startOfMonth, addMonths } from 'date-fns'
import { v4 } from 'uuid'

const newDate = (date = new Date()) => new Date(new Date(date).toDateString())
const nthMonthDay = (date, nth, day) => {
	const firstDay = startOfMonth(newDate(date))
	return addDays(firstDay, (day - firstDay.getDay() + 7) % 7 + nth * 7)
}

class Task {
	constructor({task, categoryId, date, report, taskType, groupId}) {
		if (!task) throw new Error('task must be defined')

		this.id = v4()
		this.task = task
		this.categoryId = categoryId
		this.date = newDate(date)
		this.report = report
		this.taskType = taskType
		this.groupId = groupId // MultiTasks: Multitasks are a group of tasks that have the same groupId
	}

	display() {
		throw new Error('Use implementation of this class and override this method')
	}

	isDone() {
		throw new Error('Use implementation of this class and override this method')
	}

	toggleDone() {
		throw new Error('Use implementation of this class and override this method')
	}
}

class SimpleTask extends Task {
	constructor({task, categoryId, date, report, done = undefined}) {
		super({task, categoryId, date, report, taskType: 0})

		this.done = newDate(done)
	}

	get lastTimeToDo() {
		return newDate(this.done || this.date) // done
	}

	display(d) {
		let date = newDate(d)
		if (isAfter(this.date, date)) return false
	
		if (this.report && !this.done) {
			return isToday(date)
		} else {
			return isSameDay(this.lastTimeToDo, date)
		}
	}

	isDone(date) {
		return isSameDay(this.done, newDate(date))
	}

	toggleDone(date) {
		if (this.done && isSameDay(newDate(date), newDate(this.done))) {
			this.done = undefined
		} else {
			this.done = newDate(date)
		}
	}
}

class RepeatingTask extends Task {
	constructor({task, categoryId, date, report, periodSpan, done = []}) {
		super({task, categoryId, date, report, taskType: 2})

		this.periodSpan = periodSpan
		this.done = done.map(newDate)
	}

	get lastTimeToDo() {
		return subDays(newDate(), differenceInDays(newDate(), newDate(this.done.at(-1) || this.date)) % this.periodSpan)
	}

	display(d) {
		let date = newDate(d)
		if (isAfter(this.date, date)) return false

		if (this.done.some(e => isSameDay(newDate(e), date))) {
			return true
		} else if (this.report && !this.done.some(e => isSameDay(this.lastTimeToDo, newDate(e)))) {
			return (isAfter(date, newDate()) || isSameDay(date, newDate())) && !(differenceInDays(newDate(), date) % this.periodSpan)
		} else {
			return !(differenceInDays(this.lastTimeToDo, date) % this.periodSpan)
		}
	}

	isDone(date) {
		return this.done.some(e => isSameDay(newDate(e), newDate(date)))
	}

	toggleDone(date) {
		const index = this.done.findIndex(e => isSameDay(newDate(e), newDate(date)))
		if (index + 1) {
			this.done.splice(index, 1)
		} else {
			this.done.push(newDate(date))
		}
	}
}

class WeeklyTask extends Task {
	constructor({task, categoryId, date, report, weekDays, done = []}) {
		super({task, categoryId, date, report, taskType: 1})

		this.weekDays = weekDays
		this.done = done.map(newDate)
	}

	get lastTimeToDo() { // done
		let previousDay = [...this.weekDays, ...this.weekDays.map(day => day + 7)].sort((a, b) => (a - b) > 0 ? -1 : 1).find(day => day < (newDate().getDay() + 7)) % 7
		let previousDate = subDays(newDate(), (newDate().getDay() - previousDay + 7) % 7)

		if (isAfter(this.date, previousDate)) return

		return previousDate
	}

	display(d) {
		let date = newDate(d)
		if (isAfter(this.date, date)) return false

		if (this.done.some(e => isSameDay(newDate(e), date))) {
			return true
		} else if (this.report && this.lastTimeToDo && !this.isDone(this.lastTimeToDo) && isSameDay(date, newDate())) {
			return true
		} else if (this.report && this.lastTimeToDo && !this.isDone(this.lastTimeToDo) && isSameDay(date, this.lastTimeToDo)) {
			return false
		} else {
			return this.weekDays.some(weekDay => weekDay === date.getDay())
		}
	}

	isDone(date) {
		return this.done.some(e => isSameDay(newDate(e), newDate(date)))
	}

	toggleDone(date) {
		if (this.isDone(this.lastTimeToDo)) {
			this.done.splice(this.done.indexOf(e => isSameDay(newDate(e), newDate(date))), 1)
		} else {
			this.done.push(this.lastTimeToDo)
		}
	}
}

class MonthlyTask extends Task {
	constructor({task, categoryId, monthDate, report, dayOfMonth, done = []}) {
		super({task, categoryId, date: monthDate, report, taskType: 3})

		this.monthType = 0
		this.monthDate = monthDate
		this.dayOfMonth = dayOfMonth
		this.done = done.map(newDate)

		let startDate = newDate(this.monthDate)
		startDate.setDate(this.dayOfMonth)
		this.date = newDate(startDate)
	}

	get lastTimeToDo() { // done
		let lastTimeToDo = newDate()
		if (this.dayOfMonth > lastTimeToDo.getDate()) {
			lastTimeToDo.setMonth(lastTimeToDo.getMonth() - 1)
		}
		lastTimeToDo.setDate(this.dayOfMonth)
		return lastTimeToDo
	}

	display(d) {
		let date = newDate(d)
		if (isAfter(this.date, date)) return false

		if (this.done.some(e => isSameDay(newDate(e), date))) {
			return true
		} else if (!this.report) {
			return date.getDate() === this.dayOfMonth
		} else if (this.isDone(this.lastTimeToDo)) {
			return date.getDate() === this.dayOfMonth
		} else if ((isAfter(date, this.lastTimeToDo) || isSameDay(date, this.lastTimeToDo)) && isAfter(addMonths(this.lastTimeToDo, 1), date)) {
			return isSameDay(date, newDate())
		} else {
			return date.getDate() === this.dayOfMonth
		}
	}

	isDone(date) {
		return this.done.some(e => isSameDay(newDate(e), newDate(date)))
	}

	toggleDone(date) {
		if (this.isDone(this.lastTimeToDo)) {
			this.done.splice(this.done.indexOf(e => isSameDay(newDate(e), newDate(date))), 1)
		} else {
			this.done.push(this.lastTimeToDo)
		}
	}
}

class MonthlyWeekDayTask extends Task {
	constructor({task, categoryId, monthDate, report, weekNumber, weekDay, done = []}) {
		super({task, categoryId, date: monthDate, report, taskType: 3})

		this.monthType = 1
		this.monthDate = monthDate
		this.weekNumber = weekNumber
		this.weekDay = weekDay
		this.done = done.map(newDate)

		this.date = nthMonthDay(newDate(this.monthDate), this.weekNumber, this.weekDay)
	}

	get lastTimeToDo() { // done
		// Can probably optimize all this with only one loop and a smarter check to know if we are in the correct month from the start
		let todoThisMonth = newDate()
		todoThisMonth.setDate(1)
		while(todoThisMonth.getDay() !== this.weekDay) {
			todoThisMonth = addDays(todoThisMonth, 1)
		}
		addDays(todoThisMonth, this.weekNumber * 7)
		if (!isSameDay(newDate(), todoThisMonth) && isAfter(todoThisMonth, newDate())) {
			todoThisMonth.setDate(1)
			todoThisMonth.setMonth(todoThisMonth.getMonth() - 1)
			while(todoThisMonth.getDay() !== weekDay) {
				todoThisMonth = addDays(todoThisMonth, 1)
			}
			addDays(todoThisMonth, this.weekNumber * 7)
		}
		return todoThisMonth
	}

	display(d) {
		let date = newDate(d)
		if (isAfter(this.date, date)) return false

		if (this.done.some(e => isSameDay(newDate(e), date))) {
			return true
		} else if (!this.report) {
			return isSameDay(date, nthMonthDay(date, this.weekNumber, this.weekDay))
		} else if (this.isDone(this.lastTimeToDo)) {
			return isSameDay(date, nthMonthDay(date, this.weekNumber, this.weekDay))
		} else if ((isAfter(date, this.lastTimeToDo) || isSameDay(date, this.lastTimeToDo)) && isAfter(nthMonthDay(addMonths(this.lastTimeToDo, 1), this.weekNumber, this.weekDay), date)) {
			return isSameDay(date, newDate())
		} else {
			return isSameDay(date, nthMonthDay(date, this.weekNumber, this.weekDay))
		}
	}

	isDone(date) {
		return this.done.some(e => isSameDay(newDate(e), newDate(date)))
	}

	toggleDone(date) {
		if (this.isDone(this.lastTimeToDo)) {
			this.done.splice(this.done.indexOf(e => isSameDay(newDate(e), newDate(date))), 1)
		} else {
			this.done.push(this.lastTimeToDo)
		}
	}
}

export {Task, SimpleTask, RepeatingTask, WeeklyTask, MonthlyTask, MonthlyWeekDayTask}