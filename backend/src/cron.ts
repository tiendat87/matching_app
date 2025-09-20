import cron from "node-cron";
import { computeAllMatches } from "./services/matchingService";
import { sendMatchReport } from "./services/emailService";

const schedule = process.env.CRON_SCHEDULE || "0 0 * * *";

cron.schedule(schedule, async () => {
  console.log("Running scheduled matching job...");
  try {
    const matches = await computeAllMatches();
    await sendMatchReport(matches);
    console.log(`Matching job completed. Found ${matches.length} matches.`);
  } catch (error) {
    console.error("Cron job error:", error);
  }
});

console.log(`Cron job scheduled with pattern: ${schedule}`);
