import { ref, computed, watch } from "vue";
import { calculateAgeRange } from "../utils/ageCalculator";
import type { ProfileData } from "../api/profiles";

export function useProfileValidation(formData: ProfileData) {
  // Local validation error refs
  const emailError = ref("");
  const phoneError = ref("");
  const facebookError = ref("");
  const ageRangeError = ref("");
  const displayNameError = ref("");
  const cityError = ref("");
  const federalStateError = ref("");
  const birthdateError = ref("");
  const genderError = ref("");

  // Computed for validation errors
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

  // Validation functions
  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      emailError.value = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      emailError.value = "Please enter a valid email address";
    } else {
      emailError.value = "";
    }
  };

  const validatePhone = () => {
    const phoneRegex = /^(\+49|0049|0)?[1-9]\d{1,14}$/;
    const cleaned = formData.phoneNumber.replace(/\s/g, "");
    if (!cleaned) {
      phoneError.value = "Phone number is required";
    } else if (!phoneRegex.test(cleaned)) {
      phoneError.value = "Please enter a valid German phone number";
    } else {
      phoneError.value = "";
      // Normalize the phone number
      formData.phoneNumber = cleaned;
    }
  };

  const validateFacebook = () => {
    if (formData.facebookProfile && formData.facebookProfile.trim() !== "") {
      const fbRegex = /^https?:\/\/(www\.)?facebook\.com\/.+$/;
      if (!fbRegex.test(formData.facebookProfile)) {
        facebookError.value = "Hãy nhập địa chỉ Facebook hợp lệ";
      } else {
        facebookError.value = "";
      }
    } else {
      facebookError.value = "";
    }
  };

  const validateDisplayName = () => {
    if (!formData.displayName || formData.displayName.trim().length < 2) {
      displayNameError.value = "Họ và tên phải có ít nhất 2 kí tự";
    } else if (formData.displayName.length > 20) {
      displayNameError.value = "Họ và tên không được có nhiều hơn 20 kí tự";
    } else {
      displayNameError.value = "";
    }
  };

  const validateCity = () => {
    if (!formData.city || formData.city.trim().length < 2) {
      cityError.value = "Thành phố phải có ít nhất 2 kí tự";
    } else if (formData.city.length > 20) {
      cityError.value = "Thành phố không được có nhiều hơn 20 kí tự";
    } else {
      cityError.value = "";
    }
  };

  const validateBirthdate = () => {
    if (!formData.birthdate) {
      birthdateError.value = "Hãy nhập ngày tháng năm sinh";
    } else {
      const birthDate = new Date(formData.birthdate);
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
    if (!formData.gender) {
      genderError.value = "Hãy nhập giới tính";
    } else {
      genderError.value = "";
    }
  };

  const validateFederalState = () => {
    if (!formData.federalState) {
      federalStateError.value = "Hãy chọn tiểu bang";
    } else {
      federalStateError.value = "";
    }
  };

  // Watch age range
  watch(
    () => [formData.lookingForAgeMin, formData.lookingForAgeMax],
    () => {
      if (formData.lookingForAgeMin > formData.lookingForAgeMax) {
        ageRangeError.value =
          "Minimum age must be less than or equal to maximum age";
      } else {
        ageRangeError.value = "";
      }
    }
  );

  watch(
    () => [formData.birthdate, formData.gender],
    ([newBirthdate, gender]) => {
      if (newBirthdate) {
        const { min, max } = calculateAgeRange(newBirthdate, gender);
        formData.lookingForAgeMin = min;
        formData.lookingForAgeMax = max;
      }
    }
  );

  // Validate form before submission
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

    if (!formData.displayName || formData.displayName.length < 2) {
      return false;
    }

    const birthDate = new Date(formData.birthdate);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      return false;
    }

    if (formData.interests.length === 0) {
      return false;
    }

    if (formData.interests.length > 10) {
      return false;
    }

    return true;
  };

  return {
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
    validateEmail,
    validatePhone,
    validateFacebook,
    validateDisplayName,
    validateCity,
    validateBirthdate,
    validateGender,
    validateFederalState,
    validateForm,
  };
}
