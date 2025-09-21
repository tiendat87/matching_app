/**
 * Calculate age based on birthdate
 */

export const MIN_AGE = 18;
export const MAX_AGE = 75;
export function calculateAge(birthdate: string | Date): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Calculate age range preferences based on user's age
 * For a user aged X: min = X-5, max = X+10
 * Example: 25-year-old → looking for 20-35 year olds
 */
export function calculateAgeRange(
  birthDate: string | Date,
  gender?: string
): { min: number; max: number } {
  const age = calculateAge(birthDate);
  let min, max: number;

  if (gender === "male") {
    min = Math.max(MIN_AGE, age - 10);
    max = Math.min(MAX_AGE, age + 5);
  } else {
    min = Math.max(MIN_AGE, age - 5);
    max = Math.min(MAX_AGE, age + 10);
  }
  return { min, max };
}
