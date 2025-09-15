// backend/server.ts

import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

// Load environment variables from a .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the port, using an environment variable for a professional setup
const PORT = process.env.PORT || 5000;

// This is our first API endpoint, or "route."
// It confirms that our API is running.
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount user routes under /api/v1
app.use('/api/v1', userRoutes);

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});