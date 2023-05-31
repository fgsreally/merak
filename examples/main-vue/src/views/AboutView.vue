<script setup lang="ts">
import { MerakApp, PureLoader, preload } from 'merak-vue'

preload('assets', 'vite_vue', 'http://localhost:4004', { loader: new PureLoader() })
const data = {
  data: 'data from main',
}
</script>

<template>
  <div class="about">
    <p>from vue_cli</p>
    <MerakApp name="vue_cli" url="http://localhost:4005/" keep-alive class="micro" :props="data" />
    <p>from vite-vue</p>
    <MerakApp name="vite_vue" url="http://localhost:4004" class="micro" route="/about" :props="data" />
    <p>from vite-react</p>
    <MerakApp name="vite_react" url="http://localhost:4003" keep-alive class="micro" :props="data" />
  </div>
</template>

<style>
.micro {
  border: 5px solid red;
  display: block;
}
</style>
