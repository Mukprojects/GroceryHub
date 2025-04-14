const { Category, Product } = require('../backend/models');
const slugify = require('../utils/slugify');
const fs = require('fs');
const path = require('path');

/**
 * Create a new category
 * @route POST /api/categories
 * @access Private/Admin
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if category exists
    const existingCategory = await Category.findOne({ 
      where: { name } 
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Generate slug from name
    const slug = slugify(name);
    
    // Create category object with Sequelize
    const category = await Category.create({
      name,
      description,
      slug,
      image: req.file ? `/uploads/categories/${req.file.filename}` : null,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all categories
 * @route GET /api/categories
 * @access Public
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get category by ID
 * @route GET /api/categories/:id
 * @access Public
 */
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(404).json({ message: 'Category not found' });
  }
};

/**
 * Get category by slug
 * @route GET /api/categories/slug/:slug
 * @access Public
 */
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ 
      where: { slug: req.params.slug }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update category
 * @route PUT /api/categories/:id
 * @access Private/Admin
 */
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update fields
    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }
    if (description !== undefined) category.description = description;
    
    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (category.image) {
        const oldImagePath = path.join(__dirname, '..', category.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      category.image = `/uploads/categories/${req.file.filename}`;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete category
 * @route DELETE /api/categories/:id
 * @access Private/Admin
 */
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has products
    const products = await Product.count({
      where: { categoryId: category.id }
    });

    if (products > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category with ${products} products. Remove products first.` 
      });
    }

    // Delete the image file if it exists
    if (category.image) {
      const imagePath = path.join(__dirname, '..', category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await category.destroy();
    res.json({ message: 'Category removed' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 