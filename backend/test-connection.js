const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    console.log('Attempting to connect with:', process.env.DATABASE_URL);
    await client.connect();
    console.log('Connected successfully!');
    
    // Test query
    const res = await client.query('SELECT NOW()');
    console.log('Current time from DB:', res.rows[0]);
    
    await client.end();
  } catch (err) {
    console.error('Connection error:', err.message);
    console.error('Full error:', err);
  }
}

testConnection();