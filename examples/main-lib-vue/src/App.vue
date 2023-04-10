<script setup lang="ts">
import { MerakBlock } from 'merak-vue'
</script>

<template>
  <div class="red modal">
    div from main
  </div>
  <MerakBlock name="UUID" fake-global-var="vue_lib" url="/lib.js" />
</template>
