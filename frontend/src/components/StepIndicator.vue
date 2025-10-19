<template>
  <div class="flex justify-center mb-8 space-x-3">
    <div
      v-for="n in totalSteps"
      :key="n"
      class="w-3 h-3 rounded-full transition-all"
      :class="[
        n <= (currentStep ?? 0)
          ? 'bg-gradient-to-r from-amber-400 to-pink-500 scale-125'
          : 'bg-gray-400/40',
      ]"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  currentStep: Number,
  totalSteps: Number,
});
</script>
