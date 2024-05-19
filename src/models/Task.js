import { isSameDay, isToday, isAfter, differenceInDays, subDays, addDays, startOfMonth, addMonths, subMonths } from 'date-fns'
import { v4 } from 'uuid'

const newDate = (date = new Date()) => new Date(new Date(date).toDateString())
const nthMonthDay = (date, nth, day) => {
	const firstDay = startOfMonth(newDate(date))
	return addDays(firstDay, (day - firstDay.getDay() + 7) % 7 + nth * 7)
}
const isAfterOrSame = (date1, date2) => isAfter(date1, date2) || isSameDay(date1, date2)

class Task {
	constructor({task, categoryId, date, endDate, report, taskType, groupId}) {
		if (!task) throw new Error('task must be defined')

		this.id = v4()
		this.task = task
		this.categoryId = categoryId
		this.date = newDate(date)
		this.endDate = endDate && newDate(endDate)
		this.report = report
		this.taskType = taskType
		this.groupId = groupId // MultiTasks: Multitasks are a group of tasks that have the same groupId. Obsolete
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
	constructor({task, categoryId, date, endDate, report, done = undefined}) {
		super({task, categoryId, date, endDate, report, taskType: 0})

		this.done = done && newDate(done)
	}

	get lastTimeToDo() {
		return newDate(this.done || this.date)
	}

	display(d) {
		let date = newDate(d)
		if (isAfter(this.date, date) || isAfter(date, this.endDate)) return false
	
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
	constructor({task, categoryId, date, endDate, report, periodSpan, done = []}) {
		super({task, categoryId, date, endDate, report, taskType: 2})

		this.periodSpan = periodSpan
		this.done = done.map(newDate)
	}

	get lastTimeToDo() {
		return subDays(newDate(), differenceInDays(newDate(), newDate(this.done.at(-1) || this.date)) % this.periodSpan)
	}

	display(d) {
		let date = newDate(d)
		if (isAfter(this.date, date) || isAfter(date, this.endDate)) return false

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
	constructor({task, categoryId, date, endDate, report, weekDays, done = []}) {
		super({task, categoryId, date, endDate, report, taskType: 1})

		this.weekDays = weekDays
		this.done = done.map(newDate)
	}

	get lastTimeToDo() {
		const lastTimeToDo = newDate()
		while(this.weekDays.every(wd => lastTimeToDo.getDay() !== wd)) {
			lastTimeToDo.setDate(lastTimeToDo.getDate() - 1)
		}
		return lastTimeToDo
	}

	display(d) {
		let date = newDate(d)
		if (isAfter(this.date, date) || isAfter(date, this.endDate)) return false

		const nextTimeToDo = addDays(newDate(), 1)
		while(this.weekDays.every(wd => nextTimeToDo.getDay() !== wd)) nextTimeToDo.setDate(nextTimeToDo.getDate() + 1)
		if (this.report && !this.isDone(this.lastTimeToDo) && (isAfterOrSame(date, this.lastTimeToDo)) && isAfter(nextTimeToDo, date)) {
			return isSameDay(date, newDate())
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
	constructor({task, categoryId, monthDate, monthEndDate, report, dayOfMonth, done = []}) {
		super({task, categoryId, report, taskType: 3})

		this.monthType = 0
		this.monthDate = monthDate
		this.monthEndDate = monthEndDate
		this.dayOfMonth = dayOfMonth
		this.done = done.map(newDate)

		let startDate = newDate(monthDate)
		startDate.setDate(this.dayOfMonth)
		this.date = newDate(startDate)

		let endDate = newDate(monthEndDate)
		endDate.setDate(this.dayOfMonth)
		this.endDate = newDate(endDate)
	}

	get lastTimeToDo() {
		let lastTimeToDo = newDate()
		if (this.dayOfMonth > lastTimeToDo.getDate()) {
			lastTimeToDo.setMonth(lastTimeToDo.getMonth() - 1)
		}
		lastTimeToDo.setDate(this.dayOfMonth)
		return lastTimeToDo
	}

	display(d) {
		let date = newDate(d)
		if (isAfter(this.date, date) || isAfter(date, this.endDate)) return false

		const nextTimeToDo = addMonths(this.lastTimeToDo, 1)
		if (this.report && !this.isDone(this.lastTimeToDo) && (isAfterOrSame(date, this.lastTimeToDo)) && isAfter(nextTimeToDo, date)) {
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
	constructor({task, categoryId, monthDate, monthEndDate, report, weekNumber, weekDay, done = []}) {
		super({task, categoryId, date: monthDate, report, taskType: 3})

		this.monthType = 1
		this.monthDate = monthDate
		this.monthEndDate = monthEndDate
		this.weekNumber = weekNumber
		this.weekDay = weekDay
		this.done = done.map(newDate)

		this.date = nthMonthDay(newDate(this.monthDate), this.weekNumber, this.weekDay)
		this.endDate = nthMonthDay(newDate(this.monthEndDate), this.weekNumber, this.weekDay)
	}

	get lastTimeToDo() {
		const currentNthDay = nthMonthDay(newDate(), this.weekNumber, this.weekDay)
		if (isAfter(currentNthDay, newDate())) {
			return nthMonthDay(subMonths(newDate(), 1), this.weekNumber, this.weekDay)
		} else {
			return currentNthDay
		}
	}

	display(d) {
		let date = newDate(d)
		if (isAfter(this.date, date) || isAfter(date, this.endDate)) return false

		const nextTimeToDo = nthMonthDay(addMonths(this.lastTimeToDo, 1), this.weekNumber, this.weekDay)
		if (this.report && !this.isDone(this.lastTimeToDo) && (isAfterOrSame(date, this.lastTimeToDo)) && isAfter(nextTimeToDo, date)) {
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