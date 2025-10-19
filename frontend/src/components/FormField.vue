<template>
  <div>
    <label
      class="block text-sm font-semibold mb-2"
      :class="darkMode ? 'text-gray-200' : 'text-gray-700'"
    >
      {{ label }}
    </label>

    <component
      :is="type === 'textarea' ? 'textarea' : 'input'"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :rows="type === 'textarea' ? 4 : undefined"
      class="w-full px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-amber-400 transition-all duration-200"
      :class="
        darkMode
          ? 'bg-white/10 text-white placeholder-gray-300'
          : 'bg-white/80 text-gray-700 placeholder-gray-400'
      "
      @input="$emit('input', model)"
    />

    <p v-if="error" class="mt-1 text-sm text-red-400">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: "text" },
  placeholder: String,
  error: String,
  darkMode: Boolean,
});

const model = defineModel();
</script>
