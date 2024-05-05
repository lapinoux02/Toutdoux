<template>
<div id="overlay">
	<div class="menu" :class="{expanded: expanded}" @click="expanded = false">
		<div v-if="!expanded" class="material-symbols-outlined menu-content" @click.stop="expanded = true">menu</div>
		<div v-else class="menu-content" @click.stop>
			<div class="header">Tout doux liste</div>
			<div class="separator"></div>
			<div class="menu-link" @click="goto('home')"><div class="material-symbols-outlined">label</div>Home</div>
			<div class="menu-link" @click="goto('backlog')"><div class="material-symbols-outlined">label</div>Backlog</div>
			<div class="menu-link" @click="goto('tasksManagement')"><div class="material-symbols-outlined">label</div>Tasks management</div>
			<div class="separator"></div>
			<div class="menu-link" @click="goto('newTask')"><div class="material-symbols-outlined">add_circle</div>Nouvelle tache</div>
			<div class="menu-link" @click="goto('newMultiTask')"><div class="material-symbols-outlined">add_circle</div>Nouvelle tache multiple</div>
			<div class="menu-link" @click="goto('newCategory')"><div class="material-symbols-outlined">add_circle</div>Nouvelle catégorie</div>
		</div>
	</div>
</div>
</template>
<script>
export default {
	data() {
		return {
			expanded: false
		}
	},
	methods: {
		goto(route) {
			this.$router.push({name: route})
			this.expanded = false
		}
	}
}
</script>
<style scoped>
#overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100dvh;
	pointer-events: none;
	z-index: 10;
}
#overlay * {
	pointer-events: auto;
}

#overlay .menu {
	position: absolute;
	top: 0.7rem;
	left: 0.7rem;
	color: var(--text-color);
	height: calc(24px + 0.6rem);
	width: calc(24px + 0.6rem);
	background: var(--bg-dark);
	border-bottom-right-radius: 5px;
	border-top-right-radius: 5px;
	display: flex;
}

#overlay .menu.expanded {
	height: 100dvh;
	width: 100vw;
	top: 0;
	left: 0;
	border-bottom-right-radius: 0;
	border-top-right-radius: 0;
	background: #00000022;
}

#overlay .menu .menu-content {
	margin: 0.3rem;
	background: var(--bg-dark);
	width: 0;
	height: 0;
	transition: all 1s;
}

#overlay .menu.expanded .menu-content {
	margin: 0;
	width: 80vw;
	height: 100dvh;
	background: var(--bg-dark);
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
}

#overlay .menu.expanded .menu-content .menu-link {
	margin-left: 1rem;
	line-height: 2.5rem;
	display: flex;
	gap: 1rem;
	align-items: center;
	width: calc(100% - 1rem);
}

#overlay .menu.expanded .menu-content .header {
	width: 100%;
	display: flex;
	justify-content: flex-start;
	padding: 0.5rem;
	padding-left: 2rem;
	font-weight: bold;
	font-size: 1.1rem;
}

#overlay .menu.expanded .menu-content .separator {
	border-bottom: 1px solid var(--text-color);
	margin: 1rem 0;
	width: 100%;
}
</style>