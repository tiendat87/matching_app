import transporter from "../config/email";
import { Match } from "../utils/matching";
import { stateDisplayNames } from "../utils/germanStates";
import { calculateAge } from "../utils/matching";

export async function sendMatchReport(matches: Match[]): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error("Admin email not configured");
    return;
  }

  if (!transporter) {
    console.warn("Email service not configured. Skipping email send.");
    console.log("Match Report (console output):");
    console.log(`Found ${matches.length} matches`);
    matches.forEach((match, index) => {
      console.log(
        `Match #${index + 1}: ${match.profile1.displayName} & ${
          match.profile2.displayName
        } - Score: ${match.score}`
      );
    });
    return;
  }

  const htmlContent = generateHtmlReport(matches);
  const textContent = generateTextReport(matches);

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: adminEmail,
    subject: `Dating App - Daily Match Report (${new Date().toLocaleDateString()})`,
    text: textContent,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Match report sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

function generateHtmlReport(matches: Match[]): string {
  if (matches.length === 0) {
    return "<p>No matches found today.</p>";
  }

  let html = `
    <h1>Daily Match Report</h1>
    <p>Found ${matches.length} potential matches</p>
    <hr>
  `;

  matches.forEach((match, index) => {
    const age1 = calculateAge(match.profile1.birthdate);
    const age2 = calculateAge(match.profile2.birthdate);
    const state1 =
      stateDisplayNames[match.profile1.federalState] ||
      match.profile1.federalState;
    const state2 =
      stateDisplayNames[match.profile2.federalState] ||
      match.profile2.federalState;

    html += `
      <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
        <h2>Match #${index + 1} - Score: ${match.score}/100</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 10px; vertical-align: top;">
              <h3>${match.profile1.displayName}</h3>
              <p>Age: ${age1} (Looking for: ${
      match.profile1.lookingForAgeMin
    }-${match.profile1.lookingForAgeMax})</p>
              <p>Location: ${match.profile1.city}, ${state1}</p>
              <p>Contact: ${match.profile1.email}</p>
              <p>Phone: ${match.profile1.phoneNumber}</p>
              ${
                match.profile1.facebookProfile
                  ? `<p>Facebook: <a href="${match.profile1.facebookProfile}">${match.profile1.facebookProfile}</a></p>`
                  : ""
              }
            </td>
            <td style="width: 50%; padding: 10px; vertical-align: top;">
              <h3>${match.profile2.displayName}</h3>
              <p>Age: ${age2} (Looking for: ${
      match.profile2.lookingForAgeMin
    }-${match.profile2.lookingForAgeMax})</p>
              <p>Location: ${match.profile2.city}, ${state2}</p>
              <p>Contact: ${match.profile2.email}</p>
              <p>Phone: ${match.profile2.phoneNumber}</p>
              ${
                match.profile2.facebookProfile
                  ? `<p>Facebook: <a href="${match.profile2.facebookProfile}">${match.profile2.facebookProfile}</a></p>`
                  : ""
              }
            </td>
          </tr>
        </table>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
          <p><strong>Match Details:</strong></p>
          <p>Age Compatibility: ${match.ageCompatibility}/100</p>
          <p>Location Score: ${match.locationScore}/100</p>
          <p>Federal State Distance: ${match.stateDistance}/100</p>
          <p>Shared Interests: ${match.sharedInterests.join(", ") || "None"}</p>
        </div>
      </div>
    `;
  });

  return html;
}

function generateTextReport(matches: Match[]): string {
  if (matches.length === 0) {
    return "No matches found today.";
  }

  let text = `DAILY MATCH REPORT\n`;
  text += `Found ${matches.length} potential matches\n`;
  text += "=".repeat(50) + "\n\n";

  matches.forEach((match, index) => {
    const age1 = calculateAge(match.profile1.birthdate);
    const age2 = calculateAge(match.profile2.birthdate);
    const state1 =
      stateDisplayNames[match.profile1.federalState] ||
      match.profile1.federalState;
    const state2 =
      stateDisplayNames[match.profile2.federalState] ||
      match.profile2.federalState;

    text += `Match #${index + 1} - Score: ${match.score}/100\n`;
    text += "-".repeat(30) + "\n";
    text += `\nProfile 1: ${match.profile1.displayName}\n`;
    text += `Age: ${age1} (Looking for: ${match.profile1.lookingForAgeMin}-${match.profile1.lookingForAgeMax})\n`;
    text += `Location: ${match.profile1.city}, ${state1}\n`;
    text += `Email: ${match.profile1.email}\n`;
    text += `Phone: ${match.profile1.phoneNumber}\n`;

    text += `\nProfile 2: ${match.profile2.displayName}\n`;
    text += `Age: ${age2} (Looking for: ${match.profile2.lookingForAgeMin}-${match.profile2.lookingForAgeMax})\n`;
    text += `Location: ${match.profile2.city}, ${state2}\n`;
    text += `Email: ${match.profile2.email}\n`;
    text += `Phone: ${match.profile2.phoneNumber}\n`;

    text += `\nMatch Details:\n`;
    text += `Age Compatibility: ${match.ageCompatibility}/100\n`;
    text += `Location Score: ${match.locationScore}/100\n`;
    text += `Federal State Distance: ${match.stateDistance}/100\n`;
    text += `Shared Interests: ${match.sharedInterests.join(", ") || "None"}\n`;
    text += "\n" + "=".repeat(50) + "\n\n";
  });

  return text;
}
