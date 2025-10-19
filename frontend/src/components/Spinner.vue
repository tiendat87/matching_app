<template>
  <div v-if="show" class="spinner-overlay">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{ show?: boolean }>();
const show = props.show ?? true;
</script>

<style scoped>
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.6);
  z-index: 9999;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #3490dc; /* Blue */
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
