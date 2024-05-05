<template>
<div id="new-category-view">
	<div class="screen-title">Nouvelle catégorie</div>
		<div class="new-category-form">
		<div class="form-line"><span class="material-symbols-outlined">sell</span><input class="category-input new-category-input" placeholder="Catégorie" v-model="newCategory.name"></div>
		<div class="form-line"><span class="material-symbols-outlined">palette</span><input type="color" v-model="newCategory.color"></div>
		<div class="material-symbols-outlined validate-button" :class="{valid: formValid}" @click="validate">done</div>
	</div>
</div>
</template>
<script>
import { store } from '@/store/store.js'
import ChoiceButton from '@/components/ChoiceButton.vue'

export default {
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
			this.$router.push({name: 'newTask'})
		},
		cancel() {
			this.$router.push({name: 'newTask'})
		}
	},
	components: {
		ChoiceButton
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
</style>