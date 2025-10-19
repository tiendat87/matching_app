<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700">
      Profile Images (Max 6)
    </label>

    <!-- Image Preview Grid -->
    <div class="grid grid-cols-3 gap-4">
      <!-- Existing Images -->
      <div
        v-for="(image, index) in images"
        :key="image.id || index"
        class="relative group"
      >
        <img
          :src="image.thumbnailUrl || image.preview"
          :alt="`Profile image ${index + 1}`"
          class="w-full h-32 object-cover rounded-lg"
        />
        <div
          class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2"
        >
          <button
            v-if="!image.isPrimary"
            @click="setPrimary(image)"
            type="button"
            class="p-1 bg-white rounded-full"
            title="Set as primary"
          >
            <StarIcon class="w-4 h-4 text-yellow-500" />
          </button>
          <button
            @click="removeImage(image)"
            type="button"
            class="p-1 bg-white rounded-full"
            title="Remove"
          >
            <TrashIcon class="w-4 h-4 text-red-500" />
          </button>
        </div>
        <div v-if="image.isPrimary" class="absolute top-2 left-2">
          <span class="px-2 py-1 bg-yellow-500 text-white text-xs rounded"
            >Primary</span
          >
        </div>
      </div>

      <!-- Upload Button -->
      <div
        v-if="images.length < 6"
        @click="triggerFileInput"
        class="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-pink-500 transition-colors"
      >
        <div class="text-center">
          <CameraIcon class="w-8 h-8 text-gray-400 mx-auto" />
          <span class="text-sm text-gray-500">Add Photo</span>
        </div>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
      @change="handleFileSelect"
      class="hidden"
    />

    <!-- Upload Progress -->
    <div
      v-if="uploading"
      class="bg-blue-50 border border-blue-200 rounded-lg p-4"
    >
      <div class="flex items-center">
        <div
          class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"
        ></div>
        <span class="text-sm text-blue-700">Uploading images...</span>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="uploadError"
      class="bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <p class="text-sm text-red-700">{{ uploadError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, watch } from "vue";
import axios from "axios";

// Icons (you can use heroicons or any icon library)
const CameraIcon = () => "📷";
const TrashIcon = () => "🗑️";
const StarIcon = () => "⭐";

interface ImageData {
  id?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  isPrimary?: boolean;
  preview?: string;
  file?: File;
}

const props = defineProps<{
  profileId?: number;
  existingImages?: ImageData[];
}>();

const emit = defineEmits<{
  imagesUpdated: [images: ImageData[]];
}>();

const images = ref<ImageData[]>(props.existingImages || []);
const fileInput = ref<HTMLInputElement>();
const uploading = ref(false);
const uploadError = ref("");

// Watch for changes in images array
watch(
  images,
  (newImages) => {
    console.log("Images array changed:", newImages);
  },
  { deep: true }
);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);

  console.log("Files selected:", files);
  console.log("Current images length:", images.value.length);

  if (images.value.length + files.length > 6) {
    uploadError.value = `Maximum 6 images allowed. You can add ${
      6 - images.value.length
    } more.`;
    return;
  }

  uploadError.value = "";

  // If profileId exists, upload immediately
  if (props.profileId) {
    console.log("ProfileId exists, uploading to server");
    await uploadToServer(files);
  } else {
    console.log("No profileId, creating previews");
    // Otherwise, just preview
    const filePromises = files.map((file) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            preview: e.target?.result as string,
            file: file,
          };
          console.log("Adding image data:", imageData);
          images.value.push(imageData);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    // Wait for all files to be processed, then emit
    await Promise.all(filePromises);
    console.log("All files processed, emitting images:", images.value);
    emit("imagesUpdated", images.value);
  }

  // Reset input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const uploadToServer = async (files: File[]) => {
  uploading.value = true;
  uploadError.value = "";

  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await axios.post(
      `/api/profiles/${props.profileId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    images.value.push(...response.data.images);
    emit("imagesUpdated", images.value);
  } catch (error: any) {
    uploadError.value =
      error.response?.data?.error || "Failed to upload images";
  } finally {
    uploading.value = false;
  }
};

const removeImage = async (image: ImageData) => {
  if (image.id && props.profileId) {
    try {
      await axios.delete(`/api/images/${image.id}`);
    } catch (error) {
      uploadError.value = "Failed to delete image";
      return;
    }
  }

  images.value = images.value.filter((img) => img !== image);
  emit("imagesUpdated", images.value);
};

const setPrimary = async (image: ImageData) => {
  if (image.id && props.profileId) {
    try {
      await axios.put(`/api/images/${image.id}/primary`);
    } catch (error) {
      uploadError.value = "Failed to set primary image";
      return;
    }
  }

  images.value.forEach((img) => {
    img.isPrimary = img === image;
  });
  emit("imagesUpdated", images.value);
};

// Expose method for parent component to get files for upload
// In ImageUpload.vue, add this to the defineExpose:
defineExpose({
  getFiles: () =>
    images.value.filter((img) => img.file).map((img) => img.file!),
  reset: () => {
    images.value = [];
    uploadError.value = "";
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  },
});
</script>
