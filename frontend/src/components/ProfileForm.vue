<template>
  <div class="min-h-screen bg-gradient-to-r from-sky-800 to-fuchsia-300">
    <!-- Navigation Header -->
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <router-link
            to="/"
            class="text-slate-600 hover:text-slate-700 font-semibold"
          >
            <div class="flex flex-row">
              <HomeIcon class="w-6 h-6 pr-1" />Trang chủ
            </div>
          </router-link>
          <div></div>
          <!-- Spacer for centering -->
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-3xl font-bold text-center mb-8 text-gray-500">
          Thông tin của bạn
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Display Name -->
          <div>
            <label
              for="displayName"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Họ và Tên *
            </label>
            <input
              v-model="formData.displayName"
              id="displayName"
              type="text"
              required
              minlength="2"
              maxlength="50"
              @input="validateDisplayName"
              :class="[displayNameError ? 'input-error' : 'border-gray-300']"
              placeholder="John Doe"
            />
            <p v-if="displayNameError" class="mt-1 text-sm text-red-600">
              {{ displayNameError }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Địa chỉ Email *
            </label>
            <input
              v-model="formData.email"
              id="email"
              type="email"
              required
              @input="validateEmail"
              :class="[emailError ? 'input-error' : 'border-gray-300']"
              placeholder="john@example.com"
            />
            <p v-if="emailError" class="mt-1 text-sm text-red-600">
              {{ emailError }}
            </p>
          </div>

          <!-- Phone Number -->
          <div>
            <label
              for="phoneNumber"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Số điện thoại *
            </label>
            <input
              v-model="formData.phoneNumber"
              id="phoneNumber"
              type="tel"
              required
              @input="validatePhone"
              :class="[phoneError ? 'input-error' : 'border-gray-300']"
              placeholder="+49 151 12345678 or 0151 12345678"
            />
            <p v-if="phoneError" class="mt-1 text-sm text-red-600">
              {{ phoneError }}
            </p>
          </div>

          <!-- Facebook Profile -->
          <div>
            <label
              for="facebookProfile"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Đường link Facebook
            </label>
            <input
              v-model="formData.facebookProfile"
              id="facebookProfile"
              type="url"
              @blur="validateFacebook"
              :class="[facebookError ? 'input-error' : 'border-gray-300']"
              placeholder="https://facebook.com/yourprofile"
            />
            <p v-if="facebookError" class="mt-1 text-sm text-red-600">
              {{ facebookError }}
            </p>
          </div>

          <!-- Birthdate -->
          <div>
            <label
              for="birthdate"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngày tháng năm sinh *
            </label>

            <VueDatePicker
              v-model="formData.birthdate"
              class="rounded-xl"
              :auto-apply="true"
              :close-on-auto-apply="true"
              locale="vi"
              :flow="['year', 'month', 'calendar']"
              format="dd.MM.yyyy"
              @input="validateBirthdate"
              :require="true"
              :min-date="minDate"
              :max-date="maxDate"
              :start-date="maxDate"
              placeholder="Chọn ngày tháng năm sinh"
              :time-picker="false"
              :class="[birthdateError ? 'input-error' : 'border-gray-300']"
            >
            </VueDatePicker>
            <p v-if="birthdateError" class="mt-1 text-sm text-red-600">
              {{ birthdateError }}
            </p>
          </div>

          <!-- Gender -->
          <div>
            <label
              for="gender"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Giới tính của bạn *
            </label>
            <select
              v-model="formData.gender"
              id="gender"
              required
              @change="validateGender"
              :class="[genderError ? 'border-red-500' : 'border-gray-300']"
            >
              <!-- <option value="">Chọn giới tính</option> -->
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <!-- <option value="other">Other</option> -->
            </select>
            <p v-if="genderError" class="mt-1 text-sm text-red-600">
              {{ genderError }}
            </p>
          </div>

          <!-- Age Range Preference -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Độ tuổi bạn đang tìm kiếm *
            </label>
            <div class="flex space-x-4">
              <div class="flex-1">
                <input
                  v-model.number="formData.lookingForAgeMin"
                  type="number"
                  min="18"
                  max="99"
                  required
                  :class="['border-gray-300']"
                  placeholder="Min age"
                />
              </div>
              <span class="flex items-center">to</span>
              <div class="flex-1">
                <input
                  v-model.number="formData.lookingForAgeMax"
                  type="number"
                  min="18"
                  max="99"
                  required
                  :class="['border-gray-300']"
                  placeholder="Max age"
                />
              </div>
            </div>
            <p v-if="ageRangeError" class="mt-1 text-sm text-red-600">
              {{ ageRangeError }}
            </p>
          </div>

          <!-- City -->
          <div>
            <label
              for="city"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Thành phố *
            </label>
            <CityAutocomplete
              v-model:city="formData.city"
              v-model:federalState="formData.federalState"
              :error="cityError"
              @input="validateCity"
            />

            <p v-if="cityError" class="mt-1 text-sm text-red-600">
              {{ cityError }}
            </p>
          </div>

          <!-- Federal State -->
          <div>
            <label
              for="federalState"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Tiểu bang *
            </label>
            <select
              v-model="formData.federalState"
              id="federalState"
              required
              :class="[
                federalStateError ? 'border-red-500' : 'border-gray-300',
              ]"
              class="w-full"
            >
              <option value="">Select federal state</option>
              <option
                v-for="state in germanFederalStates"
                :key="state.value"
                :value="state.value"
              >
                {{ state.label }}
              </option>
            </select>
            <p v-if="federalStateError" class="mt-1 text-sm text-red-600">
              {{ federalStateError }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sở thích * (chọn ít nhất 1 và nhiều nhất 10)
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label
                v-for="interest in availableInterests"
                :key="interest"
                class="flex items-center cursor-pointer space-x-2"
              >
                <input
                  type="checkbox"
                  :value="interest"
                  v-model="formData.interests"
                  :disabled="
                    !formData.interests.includes(interest) &&
                    formData.interests.length >= 10
                  "
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                />
                <span class="text-sm text-gray-700">{{ interest }}</span>
              </label>
            </div>
          </div>

          <!-- Bio -->
          <div>
            <label
              for="bio"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Giới thiệu qua về bạn (optional)
            </label>
            <textarea
              v-model="formData.bio"
              id="bio"
              rows="4"
              maxlength="500"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Tell us about yourself..."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              {{ formData.bio?.length || 0 }}/500 characters
            </p>
          </div>

          <ImageUpload @imagesUpdated="handleImagesUpdate" />
          <!-- Error Message -->
          <div
            v-if="error"
            class="p-4 bg-red-50 border border-red-300 rounded-lg"
          >
            <p class="text-red-800">{{ error }}</p>
          </div>

          <!-- Success Message -->
          <div
            v-if="success"
            class="p-4 bg-green-50 border border-green-300 rounded-lg"
          >
            <p class="text-green-800">Profile created successfully!</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="
              loading || formData.interests.length === 0 || hasValidationErrors
            "
            class="w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 disabled:opacity-50"
          >
            {{ loading ? "Đang gửi..." : "Gửi thông tin" }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from "../stores/profile.store";
import { storeToRefs } from "pinia";
import { HomeIcon } from "@heroicons/vue/24/solid";
import CityAutocomplete from "./CityAutocomplete.vue";
import ImageUpload from "./ImageUpload.vue";
// Use the profile store
const profileStore = useProfileStore();
// Extract reactive state and getters from the store
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
} = storeToRefs(profileStore);

// Get non-reactive data directly from the store
const { availableInterests, germanFederalStates } = profileStore;

// Debug logging
console.log("ProfileForm initialized");
console.log("availableInterests:", availableInterests);
console.log("germanFederalStates:", germanFederalStates);

// Extract actions from the store
const {
  validateEmail,
  validatePhone,
  validateFacebook,
  validateDisplayName,
  validateCity,
  validateBirthdate,
  validateGender,
  submitProfileData,
  handleImagesUpdate,
} = profileStore;

// Calculate min and max dates for birthdate picker
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

// Handle form submission
const handleSubmit = async () => {
  await submitProfileData();
};
</script>
