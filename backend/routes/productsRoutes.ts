// backend/routes/productsRoutes.ts

import express, { Request, Response } from 'express';
import Product from '../models/Product';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();

// A custom type to add the user to the Request object
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Middleware to protect routes
const protect = async (req: AuthRequest, res: Response, next: express.NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, no user found' });
      }

      // ✅ safely cast _id to string
      req.user = { id: (user._id as mongoose.Types.ObjectId).toString(), role: user.role };
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Middleware to check if the user is a supplier
const isSupplier = (req: AuthRequest, res: Response, next: express.NextFunction) => {
  if (req.user && req.user.role === 'supplier') {
    return next();
  }
  return res.status(403).json({ message: 'Not authorized as a supplier' });
};

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private (Supplier)
 */
router.post('/', protect, isSupplier, async (req: AuthRequest, res: Response) => {
  const { name, category, description, price, stock, image } = req.body;
  const supplierId = req.user!.id;

  if (!name || !category || !description || !price) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    const product = new Product({
      name,
      supplier: supplierId,
      category,
      description,
      price,
      stock,
      image,
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @desc    Get all products for the authenticated supplier
 * @route   GET /api/v1/products/mine
 * @access  Private (Supplier)
 */
router.get('/mine', protect, isSupplier, async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find({ supplier: req.user!.id });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @desc    Update a product by ID
 * @route   PUT /api/v1/products/:id
 * @access  Private (Supplier)
 */
router.put('/:id', protect, isSupplier, async (req: AuthRequest, res: Response) => {
  const { name, category, description, price, stock, image } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure the authenticated supplier owns the product
    if (product.supplier.toString() !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, description, price, stock, image },
      { new: true }
    );
    
    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Supplier)
 */
router.delete('/:id', protect, isSupplier, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure the authenticated supplier owns the product
    if (product.supplier.toString() !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    
    return res.json({ message: 'Product removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});


export default router;