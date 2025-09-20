import Profile from "../models/Profile";
import { calculateMatchScore, Match } from "../utils/matching";

export async function computeAllMatches(): Promise<Match[]> {
  const profiles = await Profile.findAll();
  const matches: Match[] = [];

  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      const match = calculateMatchScore(profiles[i], profiles[j]);
      if (match && match.score >= 40) {
        // Minimum threshold
        matches.push(match);
      }
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  return matches;
}
