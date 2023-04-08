<script setup lang="ts">
import { MerakSSR, resolveUrl } from 'merak-vue'
const data = {
  data: 'data from main-vue-ssr',
}

function callback() {
  console.log('unmount')
}
function scriptHandler({ scripts }: { scripts: HTMLScriptElement[] }) {
  scripts.forEach((script) => {
    const src = script.getAttribute('src')
    if (src)
      script.src = resolveUrl(src, 'http://127.0.0.1:4004/')
  })
}
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <MerakSSR id="vite_vue" url="http://127.0.0.1:4004/" :props="data" @before-unmount="callback" @exec-script="scriptHandler" @destroy="callback" />
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
