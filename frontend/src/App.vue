<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-r from-fuchsia-500 to-cyan-500"
  >
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-4xl font-bold text-center text-pink-600">
          Đi tìm trái tim
        </h1>
        <p class="text-center text-gray-600 mt-2">
          Find your perfect match today!
        </p>
      </div>
    </header>

    <main class="container mx-auto px-4 py-12">
      <ProfileForm />
    </main>

    <footer class="bg-white shadow-md mt-12">
      <div class="container mx-auto px-4 py-6">
        <p class="text-center text-gray-600">
          © 2024 FindYourMatch. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ProfileForm from "./components/ProfileForm.vue";
</script>
