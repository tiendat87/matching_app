import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set in environment variables");
  console.error(
    "Please create a .env file in the backend directory with DATABASE_URL"
  );
  console.error(
    "Example: DATABASE_URL=postgresql://postgres:password@localhost:5433/matchingapp"
  );
  process.exit(1);
}

console.log("Connecting to database...");

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
