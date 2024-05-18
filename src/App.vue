<script setup>
import { RouterView } from 'vue-router'
import Overlay from '@/components/Overlay.vue'
import Notification from '@/components/Notification.vue'
import {store} from '@/store/store.js'

document.addEventListener('keyup', event => {
  if (event.key === 'F1') console.log(store.tasks)
  if (event.key === 'F2') console.log(store.categories)
})

</script>

<template>
  <RouterView class="screen" />
  <Overlay></Overlay>
  <Notification></Notification>
</template>

<style scoped>
  
</style>
