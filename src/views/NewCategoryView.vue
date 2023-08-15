<template>
<div id="new-category-view">
	<div class="screen-title">Nouvelle catégorie</div>
		<div class="new-category-form">
		<input class="category-input new-category-input" placeholder="Catégorie" v-model="newCategory.name">
		<input type="color" v-model="newCategory.color">
		<div class="material-symbols-outlined validate" :class="{valid: formValid}" @click="validate">done</div>
	</div>
</div>
</template>
<script>
import { store } from '@/store/store.js'

export default {
	beforeRouteEnter(to, from, next) {
	  next(vm => vm.prevRoute = from)
	},
	data() {
		return {
			newCategory: {
				id: new Date().getTime(),
				name: undefined,
				color: '#000000'
			}
		}
	},
	computed: {
		formValid() {
			return this.newCategory.name
		}
	},
	methods: {
		validate() {
			if (!this.formValid) return

			store.addCategory(this.newCategory)
			// store.categories.push(this.newCategory)
			if (this.prevRoute) {
				this.$router.push(this.prevRoute)
			} else {
				this.$router.push({name: 'newTask'})
			}
		}
	}
}
</script>
<style scoped>
.new-category-form {
	margin: 0 1rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
.new-category-form .validate {
	align-self: center;
	width: 3rem;
	height: 3rem;
	border-radius: 3rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid grey;
	background: transparent;
	color: grey;
}
.new-category-form .validate.valid {
	background: black;
	border: 1px solid white;
	color: white;
}
</style>