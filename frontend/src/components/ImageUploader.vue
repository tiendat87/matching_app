<template>
  <div class="flex flex-col items-center text-center space-y-4">
    <label
      class="cursor-pointer bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl transition-all"
    >
      📷 Chọn ảnh
      <input
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="onFilesSelected"
      />
    </label>

    <div class="flex flex-wrap justify-center gap-3 mt-4">
      <img
        v-for="(img, idx) in previews"
        :key="idx"
        :src="img"
        class="w-24 h-24 rounded-xl object-cover shadow-md"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const emit = defineEmits(["update:images"]);
const previews = ref<string[]>([]);

const onFilesSelected = (e: any) => {
  const files = Array.from(e.target.files);
  previews.value = files.map((f: any) => URL.createObjectURL(f));
  emit("update:images", files);
};
</script>
