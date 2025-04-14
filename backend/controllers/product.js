const Product = require('../models/Product');
const Category = require('../models/Category');
const slugify = require('../utils/slugify');
const fs = require('fs');
const path = require('path');

/**
 * Create a new product
 * @route POST /api/products
 * @access Private/Admin
 */
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      stock,
      unit,
      featured,
    } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Generate slug from name
    const slug = slugify(name);

    // Create product object
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      unit,
      slug,
      ...(discountPrice && { discountPrice }),
      ...(featured !== undefined && { featured }),
      images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : [],
    });

    // Save product
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all products with filtering, sorting, and pagination
 * @route GET /api/products
 * @access Public
 */
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    const queryObj = { ...req.query };
    
    // Fields to exclude from filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // Filter by category (either id or slug)
    if (req.query.category) {
      const category = await Category.findOne({
        $or: [
          { _id: req.query.category },
          { slug: req.query.category }
        ]
      });
      
      if (category) {
        queryObj.category = category._id;
      }
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = parseInt(req.query.maxPrice);
    }
    
    // Search by name
    if (req.query.search) {
      queryObj.name = { $regex: req.query.search, $options: 'i' };
    }
    
    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    // Build query
    let query = Product.find(JSON.parse(queryStr))
      .populate('category', 'name slug')
      .skip(skip)
      .limit(limit);
    
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Execute query
    const products = await query;
    
    // Get total count for pagination
    const total = await Product.countDocuments(JSON.parse(queryStr));
    
    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get product by ID
 * @route GET /api/products/:id
 * @access Public
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get product by slug
 * @route GET /api/products/slug/:slug
 * @access Public
 */
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update product
 * @route PUT /api/products/:id
 * @access Private/Admin
 */
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      stock,
      unit,
      featured,
    } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if category exists if changing categories
    if (category && category !== product.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    // Update fields
    if (name) {
      product.name = name;
      product.slug = slugify(name);
    }
    if (description) product.description = description;
    if (price) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (unit) product.unit = unit;
    if (featured !== undefined) product.featured = featured;
    
    // Handle image updates
    if (req.files && req.files.length > 0) {
      // Delete old images if they exist
      if (product.images && product.images.length > 0) {
        product.images.forEach(image => {
          const imagePath = path.join(__dirname, '..', image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }
      
      // Add new images
      product.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete product
 * @route DELETE /api/products/:id
 * @access Private/Admin
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete product images if they exist
    if (product.images && product.images.length > 0) {
      product.images.forEach(image => {
        const imagePath = path.join(__dirname, '..', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get featured products
 * @route GET /api/products/featured
 * @access Public
 */
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.find({ featured: true })
      .populate('category', 'name slug')
      .limit(limit)
      .sort('-createdAt');
    
    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add product review
 * @route POST /api/products/:id/reviews
 * @access Private
 */
exports.addProductReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user already reviewed this product
    const alreadyReviewed = product.ratings.find(
      r => r.userId.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }
    
    // Add new review
    const newReview = {
      userId: req.user._id,
      rating: Number(rating),
      review,
      date: Date.now(),
    };
    
    product.ratings.push(newReview);
    
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 