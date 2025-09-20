const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log
});

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    // Run the migration
    await sequelize.query(`
      ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS "lookingForAgeMin" INTEGER DEFAULT 18,
      ADD COLUMN IF NOT EXISTS "lookingForAgeMax" INTEGER DEFAULT 99,
      ADD COLUMN IF NOT EXISTS "federalState" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "phoneNumber" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "facebookProfile" VARCHAR(255);
    `);
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();