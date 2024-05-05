import { isSameDay, isToday, isAfter, differenceInDays, subDays, addDays } from 'date-fns'
import { v4 } from 'uuid'

const newDate = () => new Date(new Date().toDateString())

class Task {
	constructor({task, categoryId, date, report, taskType, groupId}) {
		if (!task) throw new Error('task must be defined')

		this.id = v4()
		this.task = task
		this.categoryId = categoryId
		this.date = new Date(new Date(date).toDateString())
		this.report = report
		this.taskType = taskType
		this.groupId = groupId // MultiTasks: Multitasks are a group of tasks that have the same groupId
	}

	// isDate(d) {
	// 	let date = new Date(d)
	// 	if (isAfter(this.date, date)) {
	// 		return false
	// 	}

	// 	if (this.isDone(date)) {
	// 		return true
	// 	}

	// 	if (isSameDay(this.lastTimeToDo, date)) {
	// 		return !this.report || this.isDone(this.lastTimeToDo) || isToday(date)
	// 	} else if (this.report && isToday(date)) {
	// 		return !this.isDone(this.lastTimeToDo)
	// 	} else {
	// 		return false
	// 	}
	// }

	display() {
		throw new Error('Use implementation of this class and override this method')
	}

	isDone() {
		throw new Error('Use implementation of this class and override this method')
	}

	setDone() {
		throw new Error('Use implementation of this class and override this method')
	}

	toggleDone() {
		throw new Error('Use implementation of this class and override this method')
	}
}

class SimpleTask extends Task {
	constructor({task, categoryId, date, report, done = undefined}) {
		super({task, categoryId, date, report, taskType: 0})

		this.done = done
	}

	get lastTimeToDo() {
		return new Date(this.done || this.date) // done
	}

	display(d) {
		let date = new Date(d)
		if (isAfter(this.date, date)) return false
	
		if (this.report && !this.done) {
			return isToday(date)
		} else {
			return isSameDay(this.lastTimeToDo, date)
		}
	}

	isDone(date) {
		return isSameDay(this.done, new Date(date))
	}

	setDone(date) {
		this.done = new Date(date)
	}

	toggleDone(date) {
		if (isSameDay(new Date(date), new Date(this.done))) {
			this.done = undefined
		} else {
			this.done = new Date(date)
		}
	}
}

class RepeatingTask extends Task {
	constructor({task, categoryId, date, report, periodSpan, done = []}) {
		super({task, categoryId, date, report, taskType: 2})

		this.periodSpan = periodSpan
		this.done = done
	}

	get lastTimeToDo() {
		return subDays(newDate(), differenceInDays(newDate(), new Date(this.done.at(-1) || this.date)) % this.periodSpan)
	}

	display(d) {
		let date = new Date(d)
		if (isAfter(this.date, date)) return false

		if (this.done.some(e => isSameDay(new Date(e), date))) {
			return true
		} else if (this.report && !this.done.some(e => isSameDay(this.lastTimeToDo, new Date(e)))) {
			return (isAfter(date, newDate()) || isSameDay(date, newDate())) && !(differenceInDays(newDate(), date) % this.periodSpan)
		} else {
			return !(differenceInDays(this.lastTimeToDo, date) % this.periodSpan)
		}
	}

	isDone(date) {
		return this.done.some(e => isSameDay(new Date(e), new Date(date)))
	}

	setDone(date) {
		this.done.push(new Date(date))
	}

	toggleDone(date) {
		const index = this.done.findIndex(e => isSameDay(new Date(e), new Date(date)))
		if (index + 1) {
			this.done.splice(index, 1)
		} else {
			this.done.push(new Date(date))
		}
	}
}

class WeeklyTask extends Task {
	constructor({task, categoryId, date, report, weekDays}) {
		super({task, categoryId, date, report, taskType: 1})

		this.weekDays = weekDays
		this.done = []
	}

	get lastTimeToDo() { // done
		let previousDay = [...this.weekDays, ...this.weekDays.map(day => day + 7)].sort((a, b) => (a - b) > 0 ? -1 : 1).find(day => day < (new Date().getDay() + 7)) % 7
		return subDays(new Date(), (new Date().getDay() - previousDay + 7) % 7)
	}

	isDone(date) {
		return this.done.some(e => isSameDay(e, new Date(date)))
	}

	setDone(date) {
		this.done.push(this.lastTimeToDo)
	}
}

class MonthlyTask extends Task {
	constructor({task, categoryId, monthDate, report, dayOfMonth}) {
		super({task, categoryId, date: monthDate, report, taskType: 3})

		this.monthType = 0
		this.monthDate = monthDate
		this.dayOfMonth = dayOfMonth
		this.done = []
	}

	get lastTimeToDo() { // done
		let lastTimeToDo = new Date(date)
		if (this.dayOfMonth > date.getDay()) {
			lastTimeToDo.setMonth(lastTimeToDo.getMonth() - 1)
		}
		lastTimeToDo.setDay(this.dayOfMonth)
		return lastTimeToDo
	}

	isDone(date) {
		return this.done.some(e => isSameDay(e, new Date(date)))
	}

	setDone(date) {
		this.done.push(this.lastTimeToDo)
	}
}

class MonthlyWeekDayTask extends Task {
	constructor({task, categoryId, monthDate, report, weekNumber, weekDay}) {
		super({task, categoryId, date: monthDate, report, taskType: 3})

		this.monthType = 1
		this.monthDate = monthDate
		this.weekNumber = weekNumber
		this.weekDay = weekDay
		this.done = []
	}

	get lastTimeToDo() { // done
		// Can probably optimize all this with only one loop and a smarter check to know if we are in the correct month from the start
		let todoThisMonth = new Date()
		todoThisMonth.setDate(1)
		while(todoThisMonth.getDay() !== weekDay) {
			addDays(todoThisMonth, 1)
		}
		addDays(todoThisMonth, (this.weekNumber - 1) * 7)
		if (!isSameDay(new Date(), todoThisMonth) && isAfter(todoThisMonth, new Date())) {
			todoThisMonth.setDate(1)
			todoThisMonth.setMonth(todoThisMonth.getMonth() - 1)
			while(todoThisMonth.getDay() !== weekDay) {
				addDays(todoThisMonth, 1)
			}
			addDays(todoThisMonth, (this.weekNumber - 1) * 7)
		}
		return todoThisMonth
	}

	setDone(date) {
		this.done.push(this.lastTimeToDo)
	}
}

export {Task, SimpleTask, RepeatingTask, WeeklyTask, MonthlyTask, MonthlyWeekDayTask}