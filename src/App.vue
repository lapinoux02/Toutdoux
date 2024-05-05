<script setup>
import { RouterView } from 'vue-router'
import Overlay from '@/components/Overlay.vue'
import Notification from '@/components/Notification.vue'
</script>

<template>
  <RouterView class="screen" />
  <Overlay></Overlay>
  <Notification></Notification>
</template>

<style scoped>
  
</style>
