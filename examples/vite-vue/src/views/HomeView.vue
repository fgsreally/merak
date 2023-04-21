<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
function monitorClickEvent() {
  console.log(1)
}
monitorClickEvent()
</script>

<template>
  <main>
    <button @click="monitorClickEvent">
      11
    </button>
    <TheWelcome />
  </main>
</template>
