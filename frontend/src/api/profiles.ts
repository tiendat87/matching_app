import axios from "axios";

const API_BASE = "/api";

export interface ProfileData {
  displayName: string;
  birthdate: string;
  gender: "male" | "female";
  lookingFor: "male" | "female";
  lookingForAgeMin: number;
  lookingForAgeMax: number;
  city: string;
  federalState: string;
  phoneNumber: string;
  facebookProfile?: string;
  interests: string[];
  bio?: string;
  email: string;
}

export async function submitProfile(data: ProfileData) {
  const response = await axios.post(`${API_BASE}/profiles`, data);
  return response.data;
}
export async function citySuggestion(cityQuery: string) {
  const response = await axios.get(`${API_BASE}/city/suggestions`, {
    params: { q: cityQuery },
  });
  return response.data;
}
// Add this function to the existing file
export async function uploadProfileImages(profileId: number, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await axios.post(
    `${API_BASE}/profiles/${profileId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
