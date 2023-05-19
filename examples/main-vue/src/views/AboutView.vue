<script setup lang="ts">
import { MerakApp, PureLoader, preloadApp } from 'merak-vue'

preloadApp('vite_vue', 'http://localhost:4004', { loader: new PureLoader() })
const data = {
  data: 'data from main',
}

function mount(id: string) {
  console.log(id, 'mount')
}
function relunch() {
  console.log('relunch')
}
</script>

<template>
  <div class="about">
    <p>from vue_cli</p>
    <MerakApp name="vue_cli" url="http://localhost:4005/" keep-alive class="micro" :props="data" @mount="mount" @relunch="relunch" />
    <p>from vite-vue</p>
    <MerakApp name="vite_vue" url="http://localhost:4004" class="micro" route="/about" :props="data" @mount="mount" @relunch="relunch" />
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
