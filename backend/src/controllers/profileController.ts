import { Request, Response } from "express";
import Profile from "../models/Profile";
import ProfileImage from "../models/Image";
import { computeAllMatches } from "../services/matchingService";
import { sendMatchReport } from "../services/emailService";
import cloudinary from "../config/cloudinary";

export async function createProfile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Handle both JSON and FormData requests
    let profileData = req.body;

    // If request has files, it's FormData - parse the profile data
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Basic validation for required fields
      if (
        !profileData.displayName ||
        !profileData.email ||
        !profileData.phoneNumber
      ) {
        res.status(400).json({
          error: "Missing required fields: displayName, email, phoneNumber",
        });
        return;
      }

      // Parse interests array from JSON string
      if (profileData.interests && typeof profileData.interests === "string") {
        try {
          profileData.interests = JSON.parse(profileData.interests);
        } catch (e) {
          res.status(400).json({ error: "Invalid interests format" });
          return;
        }
      }

      // Convert string numbers to actual numbers
      if (profileData.lookingForAgeMin) {
        profileData.lookingForAgeMin = parseInt(profileData.lookingForAgeMin);
      }
      if (profileData.lookingForAgeMax) {
        profileData.lookingForAgeMax = parseInt(profileData.lookingForAgeMax);
      }
    }

    const profile = await Profile.create(profileData);

    res.status(200).json(profile);
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      console.error("Create profile error:", error);
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
