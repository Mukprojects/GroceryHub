const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: 'i', // case-insensitive
          },
        }
      : {};
    
    // Build filter object
    const filter = { ...keyword };
    
    // Filter by category ID
    if (req.query.category) {
      try {
        if (mongoose.Types.ObjectId.isValid(req.query.category)) {
          filter.category = req.query.category;
        } else {
          console.warn(`Invalid category ID format: ${req.query.category}`);
        }
      } catch (error) {
        console.error('Error parsing category ID:', error);
      }
    }
    
    // Filter by category slug
    if (req.query.categorySlug) {
      try {
        const category = await Category.findOne({ slug: req.query.categorySlug });
        if (category) {
          filter.category = category._id;
        } else {
          console.warn(`Category not found with slug: ${req.query.categorySlug}`);
        }
      } catch (error) {
        console.error('Error finding category by slug:', error);
      }
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }
    
    // Build sort object
    let sortOption = {};
    if (req.query.sort) {
      const sortParams = req.query.sort.split(',');
      
      sortParams.forEach((param) => {
        const [field, order] = param.split(':');
        sortOption[field] = order === 'desc' ? -1 : 1;
      });
    } else {
      // Default sort by createdAt descending
      sortOption = { createdAt: -1 };
    }
    
    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .populate('category', 'name slug')
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    
    const products = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .populate('category', 'name slug')
      .limit(limit);
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Check if ID is valid format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 