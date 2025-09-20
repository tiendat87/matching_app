<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-3xl font-bold text-center mb-8 text-pink-600">
      Hãy điền thông tin của bạn
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
          placeholder="John Doe"
        />
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          v-model="formData.email"
          id="email"
          type="email"
          required
          @blur="validateEmail"
          :class="[emailError ? 'border-red-500' : 'border-gray-300']"
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
          Phone Number * (German format)
        </label>
        <input
          v-model="formData.phoneNumber"
          id="phoneNumber"
          type="tel"
          required
          @blur="validatePhone"
          :class="[phoneError ? 'border-red-500' : 'border-gray-300']"
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
          Facebook Profile URL (optional)
        </label>
        <input
          v-model="formData.facebookProfile"
          id="facebookProfile"
          type="url"
          @blur="validateFacebook"
          :class="[facebookError ? 'border-red-500' : 'border-gray-300']"
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
          Birthdate *
        </label>
        <input
          v-model="formData.birthdate"
          id="birthdate"
          type="date"
          required
          :max="maxDate"
        />
      </div>

      <!-- Gender -->
      <div>
        <label
          for="gender"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Gender *
        </label>
        <select v-model="formData.gender" id="gender" required>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <!-- Looking For -->
      <div>
        <label
          for="lookingFor"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Looking For *
        </label>
        <select v-model="formData.lookingFor" id="lookingFor" required>
          <option value="">Select preference</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="both">Both</option>
        </select>
      </div>

      <!-- Age Range Preference -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Preferred Age Range *
        </label>
        <div class="flex space-x-4">
          <div class="flex-1">
            <input
              v-model.number="formData.lookingForAgeMin"
              type="number"
              min="18"
              max="99"
              required
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
        <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
          City *
        </label>
        <input
          v-model="formData.city"
          id="city"
          type="text"
          required
          minlength="2"
          maxlength="100"
          placeholder="Munich, Berlin, Hamburg..."
        />
      </div>

      <!-- Federal State -->
      <div>
        <label
          for="federalState"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Federal State (Bundesland) *
        </label>
        <select
          v-model="formData.federalState"
          id="federalState"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        >
          <option value="">Select federal state</option>
          <option value="baden-wuerttemberg">Baden-Württemberg</option>
          <option value="bayern">Bayern</option>
          <option value="berlin">Berlin</option>
          <option value="brandenburg">Brandenburg</option>
          <option value="bremen">Bremen</option>
          <option value="hamburg">Hamburg</option>
          <option value="hessen">Hessen</option>
          <option value="mecklenburg-vorpommern">Mecklenburg-Vorpommern</option>
          <option value="niedersachsen">Niedersachsen</option>
          <option value="nordrhein-westfalen">Nordrhein-Westfalen</option>
          <option value="rheinland-pfalz">Rheinland-Pfalz</option>
          <option value="saarland">Saarland</option>
          <option value="sachsen">Sachsen</option>
          <option value="sachsen-anhalt">Sachsen-Anhalt</option>
          <option value="schleswig-holstein">Schleswig-Holstein</option>
          <option value="thueringen">Thüringen</option>
        </select>
      </div>

      <!-- Interests -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Interests * (Select at least 1, max 10)
        </label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <label
            v-for="interest in availableInterests"
            :key="interest"
            class="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              :value="interest"
              v-model="formData.interests"
              :disabled="
                !formData.interests.includes(interest) &&
                formData.interests.length >= 10
              "
              class="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <span class="text-sm text-gray-700">{{ interest }}</span>
          </label>
        </div>
      </div>

      <!-- Bio -->
      <div>
        <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
          Bio (optional)
        </label>
        <textarea
          v-model="formData.bio"
          id="bio"
          rows="4"
          maxlength="500"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Tell us about yourself..."
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">
          {{ formData.bio?.length || 0 }}/500 characters
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-300 rounded-lg">
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
        class="w-full py-3 px-4 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
      >
        {{ loading ? "Creating Profile..." : "Create Profile" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { submitProfile, ProfileData } from "../api/profiles";

const availableInterests = [
  "Travel",
  "Music",
  "Sports",
  "Reading",
  "Cooking",
  "Movies",
  "Gaming",
  "Art",
  "Photography",
  "Fitness",
  "Dancing",
  "Hiking",
  "Yoga",
  "Technology",
  "Fashion",
  "Nature",
  "Pets",
  "Wine",
  "Coffee",
  "Theater",
];

const formData = ref<ProfileData>({
  displayName: "",
  email: "",
  phoneNumber: "",
  facebookProfile: "",
  birthdate: "",
  gender: "" as any,
  lookingFor: "" as any,
  lookingForAgeMin: 18,
  lookingForAgeMax: 99,
  city: "",
  federalState: "" as any,
  interests: [],
  bio: "",
});

const loading = ref(false);
const error = ref("");
const success = ref(false);
const emailError = ref("");
const phoneError = ref("");
const facebookError = ref("");
const ageRangeError = ref("");

// Calculate max date (18 years ago)
const maxDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date.toISOString().split("T")[0];
});

// Email validation
const validateEmail = () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!formData.value.email) {
    emailError.value = "Email is required";
  } else if (!emailRegex.test(formData.value.email)) {
    emailError.value = "Please enter a valid email address";
  } else {
    emailError.value = "";
  }
};

// Phone validation (German format)
const validatePhone = () => {
  const phoneRegex = /^(\+49|0049|0)?[1-9]\d{1,14}$/;
  const cleaned = formData.value.phoneNumber.replace(/\s/g, "");
  if (!cleaned) {
    phoneError.value = "Phone number is required";
  } else if (!phoneRegex.test(cleaned)) {
    phoneError.value = "Please enter a valid German phone number";
  } else {
    phoneError.value = "";
    // Normalize the phone number
    formData.value.phoneNumber = cleaned;
  }
};

// Facebook URL validation
const validateFacebook = () => {
  if (
    formData.value.facebookProfile &&
    formData.value.facebookProfile.trim() !== ""
  ) {
    const fbRegex = /^https?:\/\/(www\.)?facebook\.com\/.+$/;
    if (!fbRegex.test(formData.value.facebookProfile)) {
      facebookError.value = "Please enter a valid Facebook profile URL";
    } else {
      facebookError.value = "";
    }
  } else {
    facebookError.value = "";
  }
};

// Watch age range
watch(
  [
    () => formData.value.lookingForAgeMin,
    () => formData.value.lookingForAgeMax,
  ],
  () => {
    if (formData.value.lookingForAgeMin > formData.value.lookingForAgeMax) {
      ageRangeError.value =
        "Minimum age must be less than or equal to maximum age";
    } else {
      ageRangeError.value = "";
    }
  }
);

const hasValidationErrors = computed(() => {
  return !!(
    emailError.value ||
    phoneError.value ||
    facebookError.value ||
    ageRangeError.value
  );
});

const validateForm = (): boolean => {
  validateEmail();
  validatePhone();
  validateFacebook();

  if (hasValidationErrors.value) {
    return false;
  }

  if (!formData.value.displayName || formData.value.displayName.length < 2) {
    error.value = "Display name must be at least 2 characters";
    return false;
  }

  const birthDate = new Date(formData.value.birthdate);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  if (age < 18) {
    error.value = "You must be at least 18 years old";
    return false;
  }

  if (formData.value.interests.length === 0) {
    error.value = "Please select at least one interest";
    return false;
  }

  if (formData.value.interests.length > 10) {
    error.value = "Maximum 10 interests allowed";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  error.value = "";
  success.value = false;

  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    await submitProfile(formData.value);
    success.value = true;

    // Reset form
    formData.value = {
      displayName: "",
      email: "",
      phoneNumber: "",
      facebookProfile: "",
      birthdate: "",
      gender: "" as any,
      lookingFor: "" as any,
      lookingForAgeMin: 18,
      lookingForAgeMax: 99,
      city: "",
      federalState: "" as any,
      interests: [],
      bio: "",
    };

    setTimeout(() => {
      success.value = false;
    }, 5000);
  } catch (err: any) {
    if (err.response?.data?.error) {
      error.value = err.response.data.error;
    } else if (err.response?.data?.details) {
      error.value = err.response.data.details[0]?.message || "Validation error";
    } else {
      error.value = "Failed to create profile. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};
</script>
