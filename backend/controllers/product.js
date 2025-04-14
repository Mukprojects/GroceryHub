const { Product, Category } = require('../backend/models');
const slugify = require('../utils/slugify');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

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
      categoryId,
      countInStock,
      featured,
      weight,
      dimensions
    } = req.body;

    // Check if category exists
    const categoryExists = await Category.findByPk(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Generate slug from name
    const slug = slugify(name);

    // Create product object with Sequelize
    const product = await Product.create({
      name,
      description,
      price,
      discountPrice: discountPrice || 0,
      slug,
      countInStock: countInStock || 0,
      categoryId,
      image: req.files && req.files.length > 0 ? `/uploads/products/${req.files[0].filename}` : null,
      images: req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [],
      featured: featured === 'true' || featured === true,
      weight,
      dimensions
    });

    // Get the product with its category
    const productWithCategory = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }]
    });

    res.status(201).json(productWithCategory);
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
    const offset = (page - 1) * limit;
    
    // Build query options
    const queryOptions = {
      include: [{ model: Category, as: 'category' }],
      offset,
      limit,
      distinct: true
    };
    
    // Build where clause for filtering
    const whereClause = {};
    
    // Filter by category
    if (req.query.category) {
      const category = await Category.findOne({
        where: {
          [Op.or]: [
            { id: req.query.category },
            { slug: req.query.category }
          ]
        }
      });
      
      if (category) {
        whereClause.categoryId = category.id;
      }
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      whereClause.price = {};
      if (req.query.minPrice) whereClause.price[Op.gte] = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) whereClause.price[Op.lte] = parseFloat(req.query.maxPrice);
    }
    
    // Search by name
    if (req.query.search) {
      whereClause.name = { [Op.like]: `%${req.query.search}%` };
    }
    
    // Featured products
    if (req.query.featured === 'true') {
      whereClause.featured = true;
    }
    
    // Add where clause to query options
    if (Object.keys(whereClause).length > 0) {
      queryOptions.where = whereClause;
    }
    
    // Sorting
    if (req.query.sort) {
      const sortArray = req.query.sort.split(',').map(field => {
        if (field.startsWith('-')) {
          return [field.substring(1), 'DESC'];
        }
        return [field, 'ASC'];
      });
      queryOptions.order = sortArray;
    } else {
      queryOptions.order = [['createdAt', 'DESC']];
    }
    
    // Execute query
    const { rows: products, count: total } = await Product.findAndCountAll(queryOptions);
    
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
 * Get featured products
 * @route GET /api/products/featured
 * @access Public
 */
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.findAll({
      where: { featured: true },
      include: [{ model: Category, as: 'category' }],
      limit,
      order: [['createdAt', 'DESC']]
    });
    
    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
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
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }]
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Product not found' });
  }
};

/**
 * Get product by slug
 * @route GET /api/products/slug/:slug
 * @access Public
 */
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
      include: [{ model: Category, as: 'category' }]
    });
    
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
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const {
      name,
      description,
      price,
      discountPrice,
      categoryId,
      countInStock,
      featured,
      weight,
      dimensions
    } = req.body;
    
    // If name is changed, update slug
    if (name && name !== product.name) {
      product.slug = slugify(name);
    }
    
    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (categoryId) product.categoryId = categoryId;
    if (countInStock !== undefined) product.countInStock = countInStock;
    if (featured !== undefined) product.featured = featured === 'true' || featured === true;
    if (weight) product.weight = weight;
    if (dimensions) product.dimensions = dimensions;
    
    // Handle images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      
      // If deleteImages is true, replace all images
      if (req.body.deleteImages === 'true') {
        // Delete old image files (implementation depends on your file storage)
        if (product.images && Array.isArray(product.images)) {
          product.images.forEach(image => {
            const imagePath = path.join(__dirname, '..', image);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          });
        }
        
        product.images = newImages;
        if (newImages.length > 0) {
          product.image = newImages[0];
        }
      } else {
        // Append new images
        product.images = [...(product.images || []), ...newImages];
        if (!product.image && newImages.length > 0) {
          product.image = newImages[0];
        }
      }
    }
    
    // Save updated product
    await product.save();
    
    // Get the updated product with its category
    const updatedProduct = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }]
    });
    
    res.json(updatedProduct);
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
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete product images (implementation depends on your file storage)
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(image => {
        const imagePath = path.join(__dirname, '..', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }
    
    // Delete product
    await product.destroy();
    
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Delete product error:', error);
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
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Create review using Review model
    const { Review } = require('../backend/models');
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: {
        productId: req.params.id,
        userId
      }
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }
    
    const review = await Review.create({
      rating: Number(rating),
      comment,
      userId,
      productId: product.id
    });
    
    // Update product average rating
    const reviews = await Review.findAll({
      where: { productId: product.id }
    });
    
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    product.averageRating = avgRating;
    product.numReviews = reviews.length;
    
    await product.save();
    
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 