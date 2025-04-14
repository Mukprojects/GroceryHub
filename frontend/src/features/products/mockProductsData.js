// Mock product data for the grocery app
import additionalFruits from './additionalFruits';
import additionalVegetables from './additionalVegetables';
import additionalDairy from './additionalDairy';
import moreFruits from './moreFruits';
import moreVegetables from './moreVegetables';
import moreDairy from './moreDairy';
import lastFruits from './lastFruits';
import lastVegetables from './lastVegetables';
import lastDairy from './lastDairy';

const mockProducts = [
  {
    _id: '1',
    name: 'Fresh Organic Bananas',
    slug: 'fresh-organic-bananas',
    description: 'Naturally sweet and nutritious organic bananas. Perfect for smoothies, baking, or as a quick snack.',
    price: 299,
    discountPrice: 249,
    stock: 50,
    countInStock: 50,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
    brand: 'Organic Farms',
    rating: 4.5,
    averageRating: 4.5,
    numReviews: 12,
    isFeatured: true,
    reviews: [
      {
        _id: '101',
        name: 'John Doe',
        rating: 5,
        comment: 'Great quality bananas, very fresh!',
        createdAt: '2023-05-15T10:30:00.000Z',
      },
      {
        _id: '102',
        name: 'Jane Smith',
        rating: 4,
        comment: 'Good value for money, would buy again.',
        createdAt: '2023-05-20T14:15:00.000Z',
      },
    ],
  },
  {
    _id: '2',
    name: 'Red Delicious Apples',
    slug: 'red-delicious-apples',
    description: 'Crisp and sweet Red Delicious apples. Grown locally and picked at peak ripeness.',
    price: 379,
    discountPrice: 0,
    stock: 40,
    countInStock: 40,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    images: [],
    brand: 'Local Orchards',
    rating: 4.0,
    averageRating: 4.0,
    numReviews: 8,
    isFeatured: true,
    reviews: [],
  },
  {
    _id: '3',
    name: 'Fresh Strawberries',
    slug: 'fresh-strawberries',
    description: 'Sweet and juicy strawberries. Perfect for desserts, smoothies, or enjoying on their own.',
    price: 449,
    discountPrice: 399,
    stock: 30,
    countInStock: 30,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
    brand: 'Berry Farms',
    rating: 4.8,
    averageRating: 4.8,
    numReviews: 15,
    isFeatured: true,
    reviews: [],
  },
  {
    _id: '4',
    name: 'Organic Avocados',
    slug: 'organic-avocados',
    description: 'Creamy and nutritious organic avocados. Great for salads, toast, or making guacamole.',
    price: 499,
    discountPrice: 449,
    stock: 25,
    countInStock: 25,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    images: [],
    brand: 'Green Farms',
    rating: 4.7,
    averageRating: 4.7,
    numReviews: 20,
    isFeatured: false,
    reviews: [],
  },
  {
    _id: '5',
    name: 'Fresh Organic Broccoli',
    slug: 'fresh-organic-broccoli',
    description: 'Nutrient-rich organic broccoli. Locally grown and harvested at peak freshness.',
    price: 229,
    discountPrice: 0,
    stock: 35,
    countInStock: 35,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    images: [],
    brand: 'Green Valley',
    rating: 4.2,
    averageRating: 4.2,
    numReviews: 9,
    isFeatured: false,
    reviews: [],
  },
  {
    _id: '6',
    name: 'Fresh Spinach',
    slug: 'fresh-spinach',
    description: 'Tender and nutritious spinach leaves. Packed with vitamins and minerals. Great for salads, smoothies, or cooking.',
    price: 249,
    discountPrice: 199,
    stock: 40,
    countInStock: 40,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    images: [],
    brand: 'Green Fields',
    rating: 4.3,
    averageRating: 4.3,
    numReviews: 7,
    isFeatured: false,
    reviews: [],
  },
  {
    _id: '7',
    name: 'Bell Peppers Mix',
    slug: 'bell-peppers-mix',
    description: 'Colorful mix of red, yellow, and green bell peppers. Sweet and crunchy, perfect for salads, stir-fries, or roasting.',
    price: 349,
    discountPrice: 299,
    stock: 30,
    countInStock: 30,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599003087519-85b5d62d31e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
    brand: 'Fresh Fields',
    rating: 4.6,
    averageRating: 4.6,
    numReviews: 11,
    isFeatured: true,
    reviews: [],
  },
  {
    _id: '8',
    name: 'Organic Carrots',
    slug: 'organic-carrots',
    description: 'Sweet and crunchy organic carrots. Freshly harvested from local farms.',
    price: 179,
    discountPrice: 0,
    stock: 45,
    countInStock: 45,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5d4f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    images: [],
    brand: 'Organic Valley',
    rating: 4.4,
    averageRating: 4.4,
    numReviews: 14,
    isFeatured: false,
    reviews: [],
  },
  {
    _id: '9',
    name: 'Whole Milk',
    slug: 'whole-milk',
    description: 'Fresh whole milk from grass-fed cows. Rich in nutrients and great taste.',
    price: 299,
    discountPrice: 0,
    stock: 50,
    countInStock: 50,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
    brand: 'Happy Cows',
    rating: 4.8,
    averageRating: 4.8,
    numReviews: 22,
    isFeatured: true,
    reviews: [],
  },
  {
    _id: '10',
    name: 'Greek Yogurt',
    slug: 'greek-yogurt',
    description: 'Creamy Greek yogurt. High in protein and probiotics. Perfect for breakfast or snacks.',
    price: 329,
    discountPrice: 0,
    stock: 40,
    countInStock: 40,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    images: [],
    brand: 'Dairy Delight',
    rating: 4.5,
    averageRating: 4.5,
    numReviews: 18,
    isFeatured: false,
    reviews: [],
  },
  {
    _id: '11',
    name: 'Cheddar Cheese Block',
    slug: 'cheddar-cheese-block',
    description: 'Sharp cheddar cheese block. Aged for perfect flavor. Great for sandwiches, cooking, or cheese boards.',
    price: 449,
    discountPrice: 399,
    stock: 35,
    countInStock: 35,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    images: [],
    brand: 'Cheese Masters',
    rating: 4.7,
    averageRating: 4.7,
    numReviews: 16,
    isFeatured: true,
    reviews: [],
  },
  {
    _id: '12',
    name: 'Organic Eggs',
    slug: 'organic-eggs',
    description: 'Farm-fresh organic eggs from free-range chickens. High in protein and essential nutrients.',
    price: 379,
    discountPrice: 0,
    stock: 30,
    countInStock: 30,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    images: [],
    brand: 'Happy Hens',
    rating: 4.9,
    averageRating: 4.9,
    numReviews: 25,
    isFeatured: true,
    reviews: [],
  },
  // Add all the additional products
  ...additionalFruits,
  ...additionalVegetables,
  ...additionalDairy,
  ...moreFruits,
  ...moreVegetables,
  ...moreDairy,
  ...lastFruits,
  ...lastVegetables,
  ...lastDairy
];

// Mock categories
const mockCategories = [
  {
    _id: '1',
    name: 'Fruits',
    slug: 'fruits',
    description: 'Fresh and nutritious fruits',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: '2',
    name: 'Vegetables',
    slug: 'vegetables',
    description: 'Freshly harvested vegetables',
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: '3',
    name: 'Dairy',
    slug: 'dairy',
    description: 'Fresh dairy products',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  }
];

// Helper functions for working with mock data
const getFeaturedProducts = () => {
  return mockProducts.filter(product => product.isFeatured);
};

const getProductsByCategory = (categorySlug) => {
  const category = mockCategories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  return mockProducts.filter(product => product.category === category.name);
};

const getProductBySlug = (slug) => {
  return mockProducts.find(product => product.slug === slug);
};

const getAllProducts = (params = {}) => {
  const { search, category, minPrice, maxPrice, sort } = params;
  
  let filteredProducts = [...mockProducts];
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply category filter
  if (category) {
    filteredProducts = filteredProducts.filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Apply price range filter
  if (minPrice !== undefined && minPrice !== '') {
    filteredProducts = filteredProducts.filter(
      product => product.price >= parseFloat(minPrice)
    );
  }
  
  if (maxPrice !== undefined && maxPrice !== '') {
    filteredProducts = filteredProducts.filter(
      product => product.price <= parseFloat(maxPrice)
    );
  }
  
  // Apply sorting
  if (sort) {
    switch (sort) {
      case 'price':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case '-price':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case '-averageRating':
        filteredProducts.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'createdAt':
        // For mock data, we'll just use the default order
        break;
      case '-createdAt':
      default:
        // For mock data, we'll reverse the default order
        filteredProducts.reverse();
        break;
    }
  }
  
  // Create pagination object
  const pagination = {
    page: 1,
    pages: 1,
    total: filteredProducts.length
  };
  
  return { products: filteredProducts, pagination };
};

// Log the total number of products for verification
console.log(`Total products: ${mockProducts.length}`);

export { 
  mockProducts, 
  mockCategories, 
  getFeaturedProducts, 
  getProductsByCategory, 
  getProductBySlug,
  getAllProducts
}; 