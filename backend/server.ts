// backend/server.ts

import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Define the port, using an environment variable for a professional setup
const PORT = process.env.PORT || 5000;

// This is our first API endpoint, or "route."
// It confirms that our API is running.
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});