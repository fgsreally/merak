<script setup lang="ts">
import { MerakApp } from 'merak-vue'

const data = {
  data: 'data from main',
}
</script>

<template>
  <div class="about">
    <p>from vue_cli</p>
    <MerakApp name="vue_cli" url="http://127.0.0.1:4005/" keep-alive class="micro" :props="data" />
    <p>from vite-vue</p>
    <MerakApp name="vite_vue" url="http://127.0.0.1:4004/" :keep-alive="false" class="micro" :props="data" />
    <p>from vite-react</p>
    <MerakApp name="vite_react" url="http://127.0.0.1:4003/" keep-alive class="micro" :props="data" />
  </div>
</template>

<style>
.micro {
  border: 5px solid red;
  display: block;
}
</style>
