<!-- eslint-disable no-console -->
<script setup lang="ts">
import { MerakImport } from 'merak-vue'

import { ref } from 'vue'
// import { MerakScope } from 'merak-vue'

// const Lib = defineAsyncComponent(() => import('../lib'))
const isShow = ref(false)

function hook(msg: string) {
  console.log(msg)
}
</script>

<template>
  <div class="red modal">
    div from main
  </div>
  <button id="test" @click="isShow = !isShow">
    {{ isShow ? 'delete' : 'append' }} component
  </button>

  <MerakImport
    v-if="isShow" name="UUID" project-global-var="vue_lib" source="http://localhost:5000/lib.js"
    @after-mount="hook('aftermount')"
    @before-mount="hook('beforemount')"
    @before-unmount="hook('beforeunmount')"
    @after-unmount="hook('afterunmount')"
  />
  <!-- <MerakScope v-if="isShow" name="UUID" fake-global-var="vue_lib">
    <Lib v-bind="{ type: 'lib' }" />
  </MerakScope> -->
</template>
