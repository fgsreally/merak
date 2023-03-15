<script setup lang="ts">
import { MerakSSR } from 'merak-vue'
const data = {
  data: 'data from main-vue-ssr',
}

function callback() {
  console.log('unmount')
}
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <MerakSSR name="vite_vue" url="http://127.0.0.1:4004/" :props="data" @before-unmount="callback" />
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
