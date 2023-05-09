<script setup lang="ts">
import { MerakBlock } from 'merak-vue'
import { ref } from 'vue'
const isShow = ref(false)
</script>

<template>
  <div class="red modal">
    div from main
  </div>
  <button @click="isShow = !isShow">
    {{ isShow ? 'add' : 'delete' }} MerakBlock
  </button>
  <MerakBlock v-if="isShow" name="UUID" fake-global-var="vue_lib" url="/lib.js" />
</template>
