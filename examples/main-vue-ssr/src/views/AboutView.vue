<!-- eslint-disable no-console -->
<script setup lang="ts">
import { MerakApp } from 'merak-vue'
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
    <MerakApp ssr name="vite_vue" url="http://localhost:4004/index.html" :props="data" @before-unmount="callback" @destroy="callback" />
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
