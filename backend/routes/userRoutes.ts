// backend/routes/userRoutes.ts

import express from 'express';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import User from '../models/User';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/v1/auth/signup
// @access  Public
router.post('/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) { // 'role' is not required as it has a default value
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10); // 10 is a good default for security vs. performance

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user with the hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      role, // The role will default to 'buyer' if not provided
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;