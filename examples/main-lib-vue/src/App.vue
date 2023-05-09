<script setup lang="ts">
import { MerakScope } from 'merak-vue'
import { defineAsyncComponent, ref } from 'vue'
// @ts-expect-error miss type
const Lib = defineAsyncComponent(() => import('../lib'))
const isShow = ref(false)
</script>

<template>
  <div class="red modal">
    div from main
  </div>
  <button @click="isShow = !isShow">
    {{ isShow ? 'delete' : 'append' }} component
  </button>

  <!-- <MerakImport v-if="isShow" name="UUID" fake-global-var="vue_lib" url="/lib.js" /> -->
  <MerakScope v-if="isShow" name="UUID" fake-global-var="vue_lib">
    <Lib v-bind="{ type: 'lib' }" />
  </MerakScope>
</template>
