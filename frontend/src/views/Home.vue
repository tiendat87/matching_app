<template>
  <div
    class="min-h-screen relative overflow-hidden bg-gradient-to-r from-sky-800 via-purple-700 to-fuchsia-400 animate-gradient-x"
  >
    <!-- Heart Particles -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        v-for="n in 50"
        :key="n"
        class="heart animate-heart"
        :style="randomHeartStyle()"
      >
        ❤️
      </div>
    </div>

    <!-- Header -->
    <header class="py-16 relative z-10">
      <div class="container mx-auto px-4 text-center">
        <h1
          class="text-5xl md:text-6xl font-extrabold text-white animate-fadeInDown"
        >
          Chào mừng bạn đến với
          <span class="text-yellow-300">Kết nối trái tim! 💖</span>
        </h1>
        <p
          class="text-lg md:text-xl text-gray-200 mt-4 animate-fadeIn delay-200"
        >
          Nơi bạn có thể gặp gỡ người phù hợp, an toàn và dễ sử dụng
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-16 relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-xl text-white mb-12 font-light animate-fadeIn delay-400">
          Bạn đang tìm kiếm một nơi gặp gỡ người phù hợp, an toàn và dễ sử dụng?
          <br /><br />
          <span class="font-semibold">Kết nối trái tim</span> ra đời để giúp
          bạn: đăng ký nhanh chóng, ghép đôi thông minh, bảo vệ cộng đồng và bảo
          mật tuyệt đối.
        </p>

        <!-- Card -->
        <div
          class="bg-white rounded-2xl shadow-2xl p-8 transform transition duration-500 hover:scale-105 animate-fadeIn"
        >
          <h3 class="text-3xl font-bold text-gray-800 mb-4 animate-fadeInUp">
            Hãy đăng ký ngay
          </h3>
          <p class="text-gray-600 mb-6 animate-fadeInUp delay-100">
            Điền thông tin của bạn và chúng tôi sẽ tìm một nửa phù hợp nhất
          </p>
          <div class="flex gap-6 justify-center">
            <router-link
              to="/profile"
              @click.native="showConfetti"
              class="inline-block bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl animate-fadeInUp delay-200"
            >
              Điền thông tin
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="bg-white bg-opacity-20 backdrop-blur-md shadow-md mt-12 relative z-10"
    >
      <div class="container mx-auto px-4 py-6 text-center">
        <p class="text-gray-100">
          © 2025 Kết nối trái tim. All rights reserved.
        </p>
      </div>
    </footer>

    <!-- Confetti Canvas -->
    <canvas
      ref="confettiCanvas"
      class="absolute inset-0 pointer-events-none"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import confetti from "canvas-confetti";

const confettiCanvas = ref<HTMLCanvasElement | null>(null);

const showConfetti = () => {
  if (confettiCanvas.value) {
    const myConfetti = confetti.create(confettiCanvas.value, {
      resize: true,
      useWorker: true,
    });
    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
};

// Heart particle random style
const randomHeartStyle = () => {
  const size = Math.floor(Math.random() * 20 + 10); // 10px - 30px
  const left = Math.floor(Math.random() * 100) + "%";
  const delay = Math.random() * 5 + "s";
  const duration = Math.random() * 10 + 5 + "s";
  return {
    left,
    fontSize: size + "px",
    animationDelay: delay,
    animationDuration: duration,
  };
};
</script>

<style scoped>
/* Gradient animation */
@keyframes gradient-x {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 20s ease infinite;
}

/* Fade in animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 1s ease forwards;
}
.animate-fadeInUp {
  animation: fadeIn 1s ease forwards;
}
.animate-fadeInDown {
  animation: fadeIn 1s ease forwards;
}

.delay-100 {
  animation-delay: 0.1s;
}
.delay-200 {
  animation-delay: 0.2s;
}
.delay-400 {
  animation-delay: 0.4s;
}
.delay-600 {
  animation-delay: 0.6s;
}

/* Heart particle animation */
@keyframes floatHeart {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}
.heart {
  position: absolute;
  bottom: -50px;
  animation-name: floatHeart;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
