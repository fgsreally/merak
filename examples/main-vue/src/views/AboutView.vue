<script setup lang="ts">
import { CompileLoader, MerakApp, preload } from 'merak-vue'

// preload('assets', 'vite_vue', 'http://localhost:4004', { loader: new CompileLoader() })
const data = {
  data: 'data from main',
}

function hook(msg: string) {
  console.log(msg)
}
function addRelativeToBody({ ele }: { ele: HTMLElement }) {
  ele.querySelector('body')!.style.position = 'relative'
}
</script>

<template>
  <div class="about">
    <p>from vue_cli</p>
    <MerakApp
      name="vue_cli" url="http://localhost:4005" keep-alive class="micro" route="/#/about" :props="data"
      @tranform-document="addRelativeToBody"
    />
    <p>from vite-vue</p>
    <MerakApp
      name="vite_vue" url="http://localhost:4004" class="micro" route="/about" :props="data"
      keep-alive
      @tranform-document="addRelativeToBody"
      @after-mount="hook('aftermount')"
      @before-mount="hook('beforemount')"
      @before-unmount="hook('beforeunmount')"
      @after-unmount="hook('afterunmount')"
    />
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
