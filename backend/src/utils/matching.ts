import Profile from "../models/Profile";
import { getStateDistance } from "./germanStates";

export interface Match {
  profile1: Profile;
  profile2: Profile;
  score: number;
  sharedInterests: string[];
  ageCompatibility: number;
  locationScore: number;
  stateDistance: number;
  agePreferenceMatch: boolean;
}

export function calculateAge(birthdate: Date): number {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function checkAgePreferences(
  profile1: Profile,
  profile2: Profile
): boolean {
  const age1 = calculateAge(profile1.birthdate);
  const age2 = calculateAge(profile2.birthdate);

  // Check if both profiles match each other's age preferences
  const profile1AcceptsAge2 =
    age2 >= profile1.lookingForAgeMin && age2 <= profile1.lookingForAgeMax;
  const profile2AcceptsAge1 =
    age1 >= profile2.lookingForAgeMin && age1 <= profile2.lookingForAgeMax;

  return profile1AcceptsAge2 && profile2AcceptsAge1;
}

export function calculateAgeCompatibility(
  profile1: Profile,
  profile2: Profile
): number {
  const age1 = calculateAge(profile1.birthdate);
  const age2 = calculateAge(profile2.birthdate);
  const ageDiff = Math.abs(age1 - age2);

  // Check if ages are within each other's preferred range
  const profile1AcceptsAge2 =
    age2 >= profile1.lookingForAgeMin && age2 <= profile1.lookingForAgeMax;
  const profile2AcceptsAge1 =
    age1 >= profile2.lookingForAgeMin && age1 <= profile2.lookingForAgeMax;

  if (!profile1AcceptsAge2 || !profile2AcceptsAge1) {
    return 0; // Not within age preferences
  }

  // Calculate compatibility based on how well they match preferences
  const profile1Range = profile1.lookingForAgeMax - profile1.lookingForAgeMin;
  const profile2Range = profile2.lookingForAgeMax - profile2.lookingForAgeMin;

  // Check how centered the ages are within the preferences
  const profile1Center =
    (profile1.lookingForAgeMin + profile1.lookingForAgeMax) / 2;
  const profile2Center =
    (profile2.lookingForAgeMin + profile2.lookingForAgeMax) / 2;

  const profile1Offset = Math.abs(age2 - profile1Center) / (profile1Range / 2);
  const profile2Offset = Math.abs(age1 - profile2Center) / (profile2Range / 2);

  // Average the offsets and convert to 0-100 score
  const avgOffset = (profile1Offset + profile2Offset) / 2;
  const score = Math.max(0, (1 - avgOffset) * 100);

  // Bonus for very close ages
  if (ageDiff <= 2) {
    return Math.min(100, score + 20);
  } else if (ageDiff <= 5) {
    return Math.min(100, score + 10);
  }

  return Math.round(score);
}

export function calculateLocationScore(
  city1: string,
  city2: string,
  state1: string,
  state2: string
): number {
  // Check federal state distance
  const stateDistanceScore = getStateDistance(state1, state2);

  // If same city, perfect score
  if (city1.toLowerCase() === city2.toLowerCase()) {
    return 100;
  }

  // Otherwise, use state distance as the primary factor
  return stateDistanceScore;
}

export function calculateInterestOverlap(
  interests1: string[],
  interests2: string[]
): {
  score: number;
  shared: string[];
} {
  const shared = interests1.filter((i) => interests2.includes(i));
  const totalUnique = new Set([...interests1, ...interests2]).size;

  const score = totalUnique > 0 ? (shared.length / totalUnique) * 100 : 0;

  return { score, shared };
}

export function isCompatibleOrientation(
  profile1: Profile,
  profile2: Profile
): boolean {
  // Check if orientations match
  if (
    profile1.lookingFor === "both" ||
    profile1.lookingFor === profile2.gender
  ) {
    if (
      profile2.lookingFor === "both" ||
      profile2.lookingFor === profile1.gender
    ) {
      return true;
    }
  }
  return false;
}

export function calculateMatchScore(
  profile1: Profile,
  profile2: Profile
): Match | null {
  // Check orientation compatibility first
  if (!isCompatibleOrientation(profile1, profile2)) {
    return null;
  }

  // Check age preferences
  const agePreferenceMatch = checkAgePreferences(profile1, profile2);
  if (!agePreferenceMatch) {
    return null; // Don't match if outside age preferences
  }

  const ageCompatibility = calculateAgeCompatibility(profile1, profile2);
  const locationScore = calculateLocationScore(
    profile1.city,
    profile2.city,
    profile1.federalState,
    profile2.federalState
  );
  const stateDistance = getStateDistance(
    profile1.federalState,
    profile2.federalState
  );
  const { score: interestScore, shared: sharedInterests } =
    calculateInterestOverlap(profile1.interests, profile2.interests);

  // Weighted average with emphasis on location and age compatibility
  const totalScore =
    ageCompatibility * 0.25 + // 25% age compatibility
    stateDistance * 0.35 + // 35% federal state proximity
    interestScore * 0.3 + // 30% shared interests
    (locationScore === 100 ? 10 : 0); // 10% bonus for same city

  return {
    profile1,
    profile2,
    score: Math.round(Math.min(100, totalScore)),
    sharedInterests,
    ageCompatibility,
    locationScore,
    stateDistance,
    agePreferenceMatch,
  };
}
