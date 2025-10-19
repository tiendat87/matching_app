<template>
  <div class="w-full relative">
    <input
      type="text"
      v-model="cityQuery"
      @input="onInput"
      @keydown="onKeydown"
      placeholder=""
      class="input-modern"
    />

    <ul
      v-if="suggestions.length"
      class="absolute z-10 bg-white border rounded mt-1 w-full max-h-48 overflow-auto shadow-md"
    >
      <li
        v-for="(c, index) in suggestions"
        :key="index"
        @click="selectCity(c)"
        :class="[
          'px-3 py-2 cursor-pointer',
          highlightedIndex === index ? 'bg-blue-100' : 'hover:bg-blue-100',
        ]"
      >
        {{ c.name }} ({{ c.state || c.name }})
      </li>
    </ul>

    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { citySuggestion } from "../api/profiles"; // giả sử đây là API trả { name, federalState }[]

interface City {
  name: string;
  state: string;
  country: string;
}

// --- Props từ parent ---
interface Props {
  city: string;
  federalState: string;
}

const props = defineProps<Props>();
const highlightedIndex = ref(-1);

// --- Emits để v-model hoạt động ---
const emit = defineEmits<{
  (e: "update:city", value: string): void;
  (e: "update:federalState", value: string): void;
}>();

// --- State nội bộ ---
const cityQuery = ref(props.city); // binding input
const suggestions = ref<City[]>([]);
const error = ref("");

let debounceTimer: any;

// --- Watch parent thay đổi ---
watch(
  () => props.city,
  (newVal) => {
    cityQuery.value = newVal;
  }
);

// --- Khi user gõ input ---
const onInput = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(searchCity, 300);

  // Reset federalState khi user gõ
  emit("update:city", cityQuery.value);
  emit("update:federalState", "");
};

// --- Gọi API tìm city ---
const searchCity = async () => {
  if (!cityQuery.value || cityQuery.value.length < 2) {
    suggestions.value = [];
    return;
  }

  try {
    const data = await citySuggestion(cityQuery.value); // trả về City[]
    suggestions.value = data;
    error.value = "";
  } catch (err: any) {
    console.error("City search error:", err);
    suggestions.value = [];
    error.value = "Không thể tìm kiếm thành phố.";
  }
};
const onKeydown = (e: KeyboardEvent) => {
  if (!suggestions.value.length) return;

  if (e.key === "ArrowDown") {
    highlightedIndex.value =
      (highlightedIndex.value + 1) % suggestions.value.length;
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    highlightedIndex.value =
      (highlightedIndex.value - 1 + suggestions.value.length) %
      suggestions.value.length;
    e.preventDefault();
  } else if (e.key === "Enter") {
    if (highlightedIndex.value >= 0) {
      selectCity(suggestions.value[highlightedIndex.value]);
      highlightedIndex.value = -1;
      e.preventDefault();
    }
  } else if (e.key === "Escape") {
    suggestions.value = [];
    highlightedIndex.value = -1;
  }
};

// --- Khi user chọn city ---
const selectCity = (c: City) => {
  cityQuery.value = c.name;
  suggestions.value = [];
  error.value = "";

  // Emit để parent cập nhật v-model
  emit("update:city", c.name);
  emit("update:federalState", c.state || c.name);
};
</script>

<style scoped>
/* Optional: custom scrollbar */
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
