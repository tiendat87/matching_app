import app from "./app";
import sequelize from "./config/database";
import "./cron"; // Import cron jobs

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established");

    // Sync database
    await sequelize.sync({ alter: true });
    console.log("Database synchronized");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
