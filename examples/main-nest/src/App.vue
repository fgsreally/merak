<script setup lang="ts">
import { MerakApp } from 'merak-vue'
</script>

<template>
  <MerakApp name="main_vue" url="http://127.0.0.1:5003/" keep-alive class="micro" />
</template>

<style scoped>
.micro{
  border: 5px solid green;
  display:block;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
