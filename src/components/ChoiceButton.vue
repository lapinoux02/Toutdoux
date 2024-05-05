<template>
<div class="choice-button-holder">
	<div class="choice choice-left"><div class="material-symbols-outlined">close</div></div>
	<div class="choice choice-right" :class="{disabled: confirmDisabled}"><div class="material-symbols-outlined">done</div></div>
	<div class="selector" :class="{moving: initTouch, right: rightCheck, left: leftCheck}" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" ref="selector"></div>
</div>
</template>
<script>
export default {
	props: {
		confirmDisabled: Boolean
	},
	data() {
		return {
			initTouch: undefined,
			rightCheck: false,
			leftCheck: false,
			lastXPos: undefined
		}
	},
	methods: {
		touchStart(touchEvent) {
			this.initTouch = touchEvent.changedTouches[0]
			this.lastXPos = this.initTouch.screenX
		},
		touchMove(touchEvent) {
			let touch = [...touchEvent.changedTouches].find(touch => touch.identifier === this.initTouch.identifier)
			let newXPos = touch.screenX

			let touchDiff = newXPos - this.initTouch.screenX
			let deltaMov = this.lastXPos - touch.screenX

			if (!deltaMov) return // Nothing to do if no delta on X
			if (this.confirmDisabled && touchDiff > 0) {
				// We can't move to the right if confirm is disabled
				this.$refs.selector.style.left = `calc((var(--choice-width) - var(--selector-diameter)) / 2)`
				return
			}

			let divXStart = this.$refs.selector.getBoundingClientRect().x
			if (touchDiff > 0) {
				this.$refs.selector.style.left = `min(calc((var(--choice-width) - var(--selector-diameter)) / 2 + ${touchDiff}px), calc(var(--choice-width) - (var(--selector-diameter) + var(--choice-height)) / 2))`
			} else {
				this.$refs.selector.style.left = `max(calc((var(--choice-width) - var(--selector-diameter)) / 2 + ${touchDiff}px), calc(var(--choice-height) - var(--selector-diameter)) / 2)`
			}
			let divXEnd = this.$refs.selector.getBoundingClientRect().x

			let xDiff = divXEnd - divXStart
			if (xDiff === 0) {
				this.rightCheck = touchDiff > 0
				this.leftCheck = touchDiff < 0
			} else {
				this.rightCheck = false
				this.leftCheck = false
			}
			this.lastXPos = newXPos
		},
		touchEnd() {
			this.$refs.selector.style.left = ''
			if (this.rightCheck) {
				this.$emit('confirm')
			} else if (this.leftCheck) {
				this.$emit('cancel')
			}
			this.initTouch = undefined
			this.rightCheck = false
			this.leftCheck = false
		}
	}
}
</script>
<style>
.choice-button-holder {
	--choice-width: 6.2rem;
	--choice-height: 2.5rem;
	position: relative;
	display: flex;
	border-radius: var(--choice-height);
	height: var(--choice-height);
	width: var(--choice-width);
	align-self: center;
}
.choice-button-holder .choice {
	width: 50%;
	height: 100%;
	display: flex;
	align-items: center;
	background: var(--text-color);
	color: var(--bg-dark);
  padding: 0.2rem;
	border: 1px solid var(--bg-dark);
}
.choice-button-holder .choice.disabled {
	color: grey;
	border-color: grey;
	background: var(--bg-light);
}
.choice-button-holder .choice-left {
	border-right: unset;
	border-bottom-left-radius: var(--choice-height);
	border-top-left-radius: var(--choice-height);
  justify-content: flex-start;
}

.choice-button-holder .choice-right {
	border-left: unset;
	border-bottom-right-radius: var(--choice-height);
	border-top-right-radius: var(--choice-height);
  justify-content: flex-end;
}

.choice-button-holder .selector {
	--selector-diameter: calc(var(--choice-height) * 1.2);
	position: absolute;
	height: var(--selector-diameter);
	width: var(--selector-diameter);
	border-radius: var(--selector-diameter);
	left: calc((var(--choice-width) - var(--selector-diameter)) / 2);
	top: calc((var(--choice-height) - var(--selector-diameter)) / 2);
	background: var(--bg-light);
	transition: left 0.1s;
	border: 1px solid var(--text-color);
}
.choice-button-holder .selector.moving {
	transition: unset;
}
.choice-button-holder .selector.right {
	background: var(--text-color);
}
.choice-button-holder .selector.left {
	background: var(--bg-dark);
}
</style>