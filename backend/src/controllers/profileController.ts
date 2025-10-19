import { Request, Response } from "express";
import Profile from "../models/Profile";
import ProfileImage from "../models/Image";
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
      attributes: { exclude: ["email", "phoneNumber"] }, // Don't expose sensitive data
      include: [
        {
          model: ProfileImage,
          as: "images",
          attributes: ["id", "imageUrl", "thumbnailUrl", "isPrimary", "order"],
          order: [
            ["isPrimary", "DESC"],
            ["order", "ASC"],
          ],
        },
      ],
    });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
}

export async function getProfileById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const profileId = parseInt(req.params.id);

    const profile = await Profile.findByPk(profileId, {
      include: [
        {
          model: ProfileImage,
          as: "images",
          order: [
            ["isPrimary", "DESC"],
            ["order", "ASC"],
          ],
        },
      ],
    });

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
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
