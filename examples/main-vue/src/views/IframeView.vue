<script setup lang="ts">
import { CompileLoader, MerakApp, preload } from 'merak-vue'
</script>

<template>
  <div>
    <MerakApp
      name="iframe_vite_vue_1" url="http://localhost:4004" class="micro" route="/about"
      iframe="1"
    />
    <MerakApp
      name="iframe_vite_vue_2" url="http://localhost:4004" class="micro" route="/"
      iframe="2"
    />
  </div>
</template>

<style>
.micro {
  border: 5px solid red;
  display: block;
}
</style>
