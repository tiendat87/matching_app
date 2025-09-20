import {
  calculateAge,
  calculateAgeCompatibility,
  calculateLocationScore,
  calculateInterestOverlap,
  isCompatibleOrientation,
  calculateMatchScore,
} from "../src/utils/matching";
import Profile from "../src/models/Profile";

describe("Matching Algorithm", () => {
  describe("calculateAge", () => {
    it("should calculate age correctly", () => {
      const birthdate = new Date("1990-01-01");
      const age = calculateAge(birthdate);
      expect(age).toBeGreaterThanOrEqual(34);
    });
  });

  describe("calculateAgeCompatibility", () => {
    it("should return 100 for same age", () => {
      expect(calculateAgeCompatibility(25, 25)).toBe(100);
    });

    it("should return 80 for 5 year difference", () => {
      expect(calculateAgeCompatibility(25, 30)).toBe(80);
    });

    it("should return lower scores for larger differences", () => {
      expect(calculateAgeCompatibility(25, 40)).toBe(40);
    });
  });

  describe("calculateLocationScore", () => {
    it("should return 100 for same city", () => {
      expect(calculateLocationScore("New York", "New York")).toBe(100);
    });

    it("should return 30 for different cities", () => {
      expect(calculateLocationScore("New York", "Los Angeles")).toBe(30);
    });

    it("should be case insensitive", () => {
      expect(calculateLocationScore("new york", "NEW YORK")).toBe(100);
    });
  });

  describe("calculateInterestOverlap", () => {
    it("should calculate overlap correctly", () => {
      const interests1 = ["hiking", "reading", "cooking"];
      const interests2 = ["cooking", "hiking", "movies"];

      const result = calculateInterestOverlap(interests1, interests2);
      expect(result.shared).toEqual(["hiking", "cooking"]);
      expect(result.score).toBeCloseTo(50, 0);
    });

    it("should return 0 for no overlap", () => {
      const interests1 = ["hiking"];
      const interests2 = ["cooking"];

      const result = calculateInterestOverlap(interests1, interests2);
      expect(result.shared).toEqual([]);
      expect(result.score).toBe(0);
    });
  });

  describe("isCompatibleOrientation", () => {
    it("should match male seeking female with female seeking male", () => {
      const profile1 = { gender: "male", lookingFor: "female" } as Profile;
      const profile2 = { gender: "female", lookingFor: "male" } as Profile;

      expect(isCompatibleOrientation(profile1, profile2)).toBe(true);
    });

    it("should handle both orientation", () => {
      const profile1 = { gender: "male", lookingFor: "both" } as Profile;
      const profile2 = { gender: "female", lookingFor: "male" } as Profile;

      expect(isCompatibleOrientation(profile1, profile2)).toBe(true);
    });

    it("should not match incompatible orientations", () => {
      const profile1 = { gender: "male", lookingFor: "male" } as Profile;
      const profile2 = { gender: "female", lookingFor: "female" } as Profile;

      expect(isCompatibleOrientation(profile1, profile2)).toBe(false);
    });
  });
});
