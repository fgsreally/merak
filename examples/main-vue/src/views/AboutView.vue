<script setup lang="ts">
import { MerakApp } from 'merak-vue'

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
    <MerakApp name="vue_cli" url="http://127.0.0.1:4005/" keep-alive class="micro" :props="data" @mount="mount" @relunch="relunch" />
    <p>from vite-vue</p>
    <MerakApp name="vite_vue" url="http://127.0.0.1:4004/" class="micro" :props="data" @mount="mount" @relunch="relunch" />
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
