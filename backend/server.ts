// backend/server.ts

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productsRoutes';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the port (default: 5000)
const PORT = process.env.PORT || 5000;

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/v1/auth', userRoutes);      // e.g. /api/v1/auth/signup, /api/v1/auth/login
app.use('/api/v1/products', productRoutes); // e.g. /api/v1/products, /api/v1/products/mine

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
