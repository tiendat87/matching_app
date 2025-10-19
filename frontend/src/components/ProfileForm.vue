<template>
  <div
    class="min-h-screen bg-gradient-to-r from-sky-800 to-fuchsia-300 flex justify-center py-10"
  >
    <div
      class="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 relative overflow-hidden"
    >
      <!-- Step indicator -->
      <div class="flex justify-between mb-8">
        <div
          v-for="n in totalSteps"
          :key="n"
          class="flex-1 h-2 mx-1 rounded-full transition-all duration-300"
          :class="n <= currentStep ? 'gradient-bg' : 'bg-gray-200'"
        ></div>
      </div>

      <!-- Step transitions -->
      <transition name="fade" mode="out-in">
        <!-- STEP 1: Personal info -->
        <form
          v-if="currentStep === 1"
          key="step1"
          @submit.prevent="goNextStep"
          class="space-y-6"
        >
          <h2 class="text-2xl font-bold text-gray-600 text-center">
            Bước 1: Thông tin cá nhân
          </h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Họ và Tên *</label
            >
            <input
              v-model="formData.displayName"
              type="text"
              @input="validateDisplayName"
              required
              class="input-modern"
            />
            <p v-if="displayNameError" class="error-text">
              {{ displayNameError }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Email *</label
            >
            <input
              v-model="formData.email"
              type="email"
              required
              @input="validateEmail"
              class="input-modern"
            />
            <p v-if="emailError" class="error-text">{{ emailError }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Số điện thoại *</label
            >
            <input
              v-model="formData.phoneNumber"
              type="tel"
              required
              @input="validatePhone"
              class="input-modern"
            />
            <p v-if="phoneError" class="error-text">{{ phoneError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Đường link Facebook</label
            >

            <input
              v-model="formData.facebookProfile"
              id="facebookProfile"
              type="url"
              @blur="validateFacebook"
              class="input-modern"
              placeholder="https://facebook.com/yourprofile"
            />
            <p v-if="facebookError" class="mt-1 text-sm text-red-600">
              {{ facebookError }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Ngày sinh *</label
            >
            <VueDatePicker
              v-model="formData.birthdate"
              :auto-apply="true"
              :close-on-auto-apply="true"
              locale="vi"
              :flow="['year', 'month', 'calendar']"
              format="dd.MM.yyyy"
              :min-date="minDate"
              :max-date="maxDate"
              placeholder="Chọn ngày sinh"
              :teleport="true"
              @input="validateBirthdate"
              class="input-modern cursor-pointer"
            />
            <p v-if="birthdateError" class="error-text">{{ birthdateError }}</p>
          </div>

          <div class="flex justify-end pt-4">
            <button type="submit" class="btn-primary">Tiếp tục</button>
          </div>
        </form>

        <!-- STEP 2: Gender + Location -->
        <form
          v-else-if="currentStep === 2"
          key="step2"
          @submit.prevent="goNextStep"
          class="space-y-6"
        >
          <h2 class="text-2xl font-bold text-gray-600 text-center">
            Bước 2: Giới tính & địa chỉ
          </h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Giới tính *</label
            >
            <select
              v-model="formData.gender"
              @change="validateGender"
              class="input-modern"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
            <p v-if="genderError" class="error-text">{{ genderError }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Thành phố *</label
            >
            <CityAutocomplete
              v-model:city="formData.city"
              v-model:federalState="formData.federalState"
              :error="cityError"
              @input="validateCity"
            />
            <p v-if="cityError" class="error-text">{{ cityError }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Tiểu bang *</label
            >
            <select
              v-model="formData.federalState"
              class="input-modern"
              required
            >
              <option value="">Chọn tiểu bang</option>
              <option
                v-for="state in store.germanFederalStates"
                :key="state.value"
                :value="state.value"
              >
                {{ state.label }}
              </option>
            </select>
            <p v-if="federalStateError" class="error-text">
              {{ federalStateError }}
            </p>
          </div>

          <div class="flex justify-between pt-4">
            <button type="button" class="btn-primary" @click="goPrevStep">
              Quay lại
            </button>
            <button type="submit" class="btn-primary">Tiếp tục</button>
          </div>
        </form>

        <!-- STEP 3: Interests + Bio + Images -->
        <!-- STEP 3: Interests + Bio + Images -->
        <form
          v-else-if="currentStep === 3"
          key="step3"
          @submit.prevent="handleSubmit"
          class="space-y-6"
        >
          <h2 class="text-2xl font-bold text-gray-600 text-center">
            Bước 3: Sở thích & Ảnh
          </h2>

          <!-- Interests as pill buttons -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sở thích * (tối đa 10)
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                v-for="interest in store.availableInterests"
                :key="interest"
                type="button"
                @click="toggleInterest(interest)"
                :class="[
                  'px-4 py-2 rounded-full border transition-all duration-200 ease-out transform focus:outline-none',
                  formData.interests.includes(interest)
                    ? 'bg-gradient-to-r from-fuchsia-500 to-sky-500 text-white scale-105 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
                ]"
              >
                {{ interest }}
              </button>
            </div>
            <p v-if="ageRangeError" class="error-text">{{ ageRangeError }}</p>
          </div>

          <!-- Bio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Giới thiệu bản thân</label
            >
            <textarea
              v-model="formData.bio"
              rows="3"
              class="input-modern"
              placeholder="Giới thiệu ngắn về bạn..."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              {{ formData.bio?.length || 0 }}/500 ký tự
            </p>
          </div>

          <!-- Image Upload -->
          <ImageUpload @imagesUpdated="handleImagesUpdate" />

          <!-- Buttons -->
          <div class="flex justify-between pt-4">
            <button type="button" class="btn-primary" @click="goPrevStep">
              Quay lại
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="
                loading ||
                formData.interests.length === 0 ||
                hasValidationErrors
              "
            >
              {{ loading ? "Đang gửi..." : "Gửi thông tin" }}
            </button>
          </div>
        </form>
      </transition>

      <!-- Error & Success -->
      <div
        v-if="error"
        class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
      >
        {{ error }}
      </div>
      <div
        v-if="success"
        class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
      >
        Hồ sơ đã được gửi thành công!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProfileStore } from "../stores/profile.store";
import CityAutocomplete from "./CityAutocomplete.vue";
import ImageUpload from "./ImageUpload.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { storeToRefs } from "pinia";

const store = useProfileStore();
const {
  formData,
  loading,
  error,
  success,

  emailError,
  phoneError,
  facebookError,
  ageRangeError,
  displayNameError,
  cityError,
  federalStateError,
  birthdateError,
  genderError,
  hasValidationErrors,
} = storeToRefs(store);

const {
  validateEmail,
  validatePhone,
  validateDisplayName,
  validateCity,
  validateBirthdate,
  validateGender,
  validateFederalState,
  submitProfileData,
  handleImagesUpdate,
  validateFacebook,
} = store;

const totalSteps = 3;
const currentStep = ref(1);

const today = new Date();
const maxDate = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate()
);
const minDate = new Date(
  today.getFullYear() - 70,
  today.getMonth(),
  today.getDate()
);
const toggleInterest = (interest: string) => {
  if (formData.value.interests.includes(interest)) {
    formData.value.interests = formData.value.interests.filter(
      (i) => i !== interest
    );
  } else if (formData.value.interests.length < 10) {
    formData.value.interests.push(interest);
  }
};
// Step logic
const goNextStep = () => {
  const valid = store.validateStep(currentStep.value);
  if (valid && currentStep.value < totalSteps) currentStep.value++;
};
const goPrevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

// Submit
const handleSubmit = async () => {
  await submitProfileData();
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
button {
  transition: all 0.2s ease;
}
button:active {
  transform: scale(0.95);
}
</style>
