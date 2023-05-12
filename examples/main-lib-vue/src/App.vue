<script setup lang="ts">
import { MerakImport } from 'merak-vue'

import { ref } from 'vue'
// import { MerakScope } from 'merak-vue'

// const Lib = defineAsyncComponent(() => import('../lib'))
const isShow = ref(false)
</script>

<template>
  <div class="red modal">
    div from main
  </div>
  <button @click="isShow = !isShow">
    {{ isShow ? 'delete' : 'append' }} component
  </button>

  <MerakImport v-if="isShow" name="UUID" fake-global-var="vue_lib" url="/lib.js" />
  <!-- <MerakScope v-if="isShow" name="UUID" fake-global-var="vue_lib">
    <Lib v-bind="{ type: 'lib' }" />
  </MerakScope> -->
</template>
