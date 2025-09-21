import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { profileSchema } from "./schemas/profileSchema";
import { validate } from "./middleware/validation";
import { requireApiKey } from "./middleware/auth";
import {
  createProfile,
  getProfiles,
  runMatching,
} from "./controllers/profileController";
import { getCitySuggestions } from "./controllers/citySuggestionController";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/profiles", validate(profileSchema), createProfile);
app.get("/profiles", getProfiles);
app.get("/city/suggestions", getCitySuggestions);
app.post("/run-matching", requireApiKey, runMatching);

export default app;
