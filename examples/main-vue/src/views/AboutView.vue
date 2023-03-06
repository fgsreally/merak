<script setup lang="ts">
import { MerakApp } from 'merak-vue'
</script>

<template>
  <div class="about">
    <p>from vue_cli</p>
    <merak-app name="vue_cli" url="http://127.0.0.1:8080/" keep-alive class="micro" />
    <p>from vite-vue</p>

    <merak-app name="vite_vue" url="http://127.0.0.1:5173/" keep-alive class="micro" />
  </div>
</template>

<style>
.micro {
  border: 5px solid red;
  display: block;
}
</style>
