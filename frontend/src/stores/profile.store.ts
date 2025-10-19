import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import {
  submitProfile,
  ProfileData,
  uploadProfileImages,
} from "../api/profiles";
import { calculateAgeRange } from "../utils/ageCalculator";

export const useProfileStore = defineStore("profile", () => {
  // Debug logging
  console.log("ProfileStore initialized");

  // State
  const availableInterests = [
    "Du lịch",
    "Nghe nhạc",
    "Thể thao",
    "Đọc sách",
    "Nấu ăn",
    "Xem phim",
    "Chơi game",
    "Nghệ thuật",
    "Chụp ảnh",
    "Fitness",
    "Nhảy",
    "Leo núi",
    "Yoga",
    "Công nghệ",
    "Thời trang",
    "Thiên nhiên",
    "Nuôi thú",
    "Đàn ghi ta",
  ];

  const germanFederalStates = [
    { value: "baden-wuerttemberg", label: "Baden-Württemberg" },
    { value: "bayern", label: "Bayern" },
    { value: "berlin", label: "Berlin" },
    { value: "brandenburg", label: "Brandenburg" },
    { value: "bremen", label: "Bremen" },
    { value: "hamburg", label: "Hamburg" },
    { value: "hessen", label: "Hessen" },
    { value: "mecklenburg-vorpommern", label: "Mecklenburg-Vorpommern" },
    { value: "niedersachsen", label: "Niedersachsen" },
    { value: "nordrhein-westfalen", label: "Nordrhein-Westfalen" },
    { value: "rheinland-pfalz", label: "Rheinland-Pfalz" },
    { value: "saarland", label: "Saarland" },
    { value: "sachsen", label: "Sachsen" },
    { value: "sachsen-anhalt", label: "Sachsen-Anhalt" },
    { value: "schleswig-holstein", label: "Schleswig-Holstein" },
    { value: "thueringen", label: "Thüringen" },
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
    lookingForAgeMax: 75,
    city: "",
    federalState: "" as any,
    interests: [],
    bio: "",
    images: [],
  });

  const loading = ref(false);
  const error = ref("");
  const success = ref(false);
  const emailError = ref("");
  const phoneError = ref("");
  const facebookError = ref("");
  const ageRangeError = ref("");
  const displayNameError = ref("");
  const cityError = ref("");
  const federalStateError = ref("");
  const birthdateError = ref("");
  const genderError = ref("");

  // Getters
  const maxDate = computed(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split("T")[0];
  });

  const lookingForValue = computed(() => {
    if (formData.value.gender === "female") return "male";
    else if (formData.value.gender === "male") return "female";
  });

  const hasValidationErrors = computed(() => {
    return !!(
      emailError.value ||
      phoneError.value ||
      facebookError.value ||
      ageRangeError.value ||
      displayNameError.value ||
      cityError.value ||
      federalStateError.value ||
      birthdateError.value ||
      genderError.value
    );
  });

  // Actions
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

  const validateFacebook = () => {
    if (
      formData.value.facebookProfile &&
      formData.value.facebookProfile.trim() !== ""
    ) {
      const fbRegex = /^https?:\/\/(www\.)?facebook\.com\/.+$/;
      if (!fbRegex.test(formData.value.facebookProfile)) {
        facebookError.value = "Hãy nhập địa chỉ Facebook hợp lệ";
      } else {
        facebookError.value = "";
      }
    } else {
      facebookError.value = "";
    }
  };

  const validateDisplayName = () => {
    if (
      !formData.value.displayName ||
      formData.value.displayName.trim().length < 2
    ) {
      displayNameError.value = "Họ và tên phải có ít nhất 2 kí tự";
    } else if (formData.value.displayName.length > 20) {
      displayNameError.value = "Họ và tên không được có nhiều hơn 20 kí tự";
    } else {
      displayNameError.value = "";
    }
  };

  const validateCity = () => {
    if (!formData.value.city || formData.value.city.trim().length < 2) {
      cityError.value = "Thành phố phải có ít nhất 2 kí tự";
    } else if (formData.value.city.length > 20) {
      cityError.value = "Thành phố không được có nhiều hơn 20 kí tự";
    } else {
      cityError.value = "";
    }
  };

  const validateBirthdate = () => {
    if (!formData.value.birthdate) {
      birthdateError.value = "Hãy nhập ngày tháng năm sinh";
    } else {
      const birthDate = new Date(formData.value.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      if (age < 18) {
        birthdateError.value = "Bạn phải ít nhất 18 tuổi";
      } else {
        birthdateError.value = "";
      }
    }
  };

  const validateGender = () => {
    if (!formData.value.gender) {
      genderError.value = "Hãy nhập giới tính";
    } else {
      genderError.value = "";
    }
  };

  const validateFederalState = () => {
    if (!formData.value.federalState) {
      federalStateError.value = "Hãy chọn tiểu bang";
    } else {
      federalStateError.value = "";
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

  watch(
    [() => formData.value.birthdate, () => formData.value.gender],
    ([newBirthdate, gender]) => {
      if (newBirthdate) {
        const { min, max } = calculateAgeRange(newBirthdate, gender);
        formData.value.lookingForAgeMin = min;
        formData.value.lookingForAgeMax = max;
      }
    }
  );
  // Watch birthdate to update age range defaults

  const validateForm = (): boolean => {
    validateEmail();
    validatePhone();
    validateFacebook();
    validateDisplayName();
    validateCity();
    validateFederalState();
    validateBirthdate();
    validateGender();

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

  const submitProfileData = async () => {
    error.value = "";
    success.value = false;

    if (!validateForm()) {
      return;
    }

    loading.value = true;

    try {
      formData.value = {
        ...formData.value,
        lookingFor: lookingForValue.value!,
      };

      console.log("Submitting profile with images:", formData.value.images);
      const profile = await submitProfile(formData.value);
      console.log("Profile created successfully:", profile);
      success.value = true;

      if (formData.value.images && formData.value.images.length > 0) {
        await uploadProfileImages(profile.id, formData.value.images);
      }
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
        images: [],
      };

      setTimeout(() => {
        success.value = false;
      }, 5000);
    } catch (err: any) {
      if (err.response?.data?.error) {
        error.value = err.response.data.error;
      } else if (err.response?.data?.details) {
        error.value =
          err.response.data.details[0]?.message || "Validation error";
      } else {
        error.value = "Failed to create profile. Please try again.";
      }
    } finally {
      loading.value = false;
    }
  };

  const resetForm = () => {
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
      images: [],
    };
    // Reset all errors
    error.value = "";
    emailError.value = "";
    phoneError.value = "";
    facebookError.value = "";
    ageRangeError.value = "";
    displayNameError.value = "";
    cityError.value = "";
    federalStateError.value = "";
    birthdateError.value = "";
    genderError.value = "";
    success.value = false;
  };

  const handleImagesUpdate = (images: any[]) => {
    console.log("Images updated:", images);
    console.log("Images length:", images.length);
    console.log(
      "Images with files:",
      images.filter((img) => img.file)
    );

    formData.value.images = images
      .filter((img) => img.file)
      .map((img) => img.file);

    console.log("FormData images after update:", formData.value.images);
    console.log("FormData images length:", formData.value.images.length);
  };

  return {
    // State
    availableInterests,
    germanFederalStates,
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

    // Getters
    maxDate,
    hasValidationErrors,

    // Actions
    validateEmail,
    validatePhone,
    validateFacebook,
    validateDisplayName,
    validateCity,
    validateBirthdate,
    validateGender,
    validateForm,
    submitProfileData,
    resetForm,
    handleImagesUpdate,
  };
});
