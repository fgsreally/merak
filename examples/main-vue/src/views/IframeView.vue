<script setup lang="ts">
import { CompileLoader, MerakApp, preload } from 'merak-vue'
const props = {
  data: '11',
}
</script>

<template>
  <div>
    <MerakApp
      name="iframe_vite_vue_1" url="http://localhost:4004" class="micro" route="/about"
      iframe="1"
      :props="props"
    />
    <MerakApp
      name="iframe_vite_vue_2" url="http://localhost:4004" class="micro" route="/"
      iframe="2"
      :props="props"
    />
  </div>
</template>

<style>
.micro {
  border: 5px solid red;
  display: block;
}
</style>
