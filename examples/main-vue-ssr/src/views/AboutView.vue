<script setup lang="ts">
import { MerakSSR } from 'merak-vue'
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <MerakSSR name="vite_vue" url="http://127.0.0.1:4004/" :is-keep="false" />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
