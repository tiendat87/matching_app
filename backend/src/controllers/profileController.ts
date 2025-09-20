import { Request, Response } from "express";
import Profile from "../models/Profile";
import { computeAllMatches } from "../services/matchingService";
import { sendMatchReport } from "../services/emailService";

export async function createProfile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Failed to create profile" });
    }
  }
}

export async function getProfiles(req: Request, res: Response): Promise<void> {
  try {
    const profiles = await Profile.findAll({
      attributes: { exclude: ["email"] }, // Don't expose emails
    });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
}

export async function runMatching(req: Request, res: Response): Promise<void> {
  try {
    const matches = await computeAllMatches();
    await sendMatchReport(matches);

    res.json({
      message: "Matching completed and report sent",
      matchCount: matches.length,
    });
  } catch (error) {
    console.error("Matching error:", error);
    res.status(500).json({ error: "Failed to run matching" });
  }
}
