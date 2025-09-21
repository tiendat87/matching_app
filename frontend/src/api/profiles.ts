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
  federalState:
    | "baden-wuerttemberg"
    | "bayern"
    | "berlin"
    | "brandenburg"
    | "bremen"
    | "hamburg"
    | "hessen"
    | "mecklenburg-vorpommern"
    | "niedersachsen"
    | "nordrhein-westfalen"
    | "rheinland-pfalz"
    | "saarland"
    | "sachsen"
    | "sachsen-anhalt"
    | "schleswig-holstein"
    | "thueringen";
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
