const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('./backend/models');

// Load environment variables
dotenv.config();

// Helper function to read password from file if DB_PASSWORD_FILE is set
function getDbPassword() {
  if (process.env.DB_PASSWORD_FILE && fs.existsSync(process.env.DB_PASSWORD_FILE)) {
    return fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8').trim();
  }
  return process.env.DB_PASSWORD || '';
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Define port
const PORT = process.env.PORT || 5000;

// Helper function to print database connection errors with helpful messages
function printDBError(error) {
  console.error('\nDatabase connection error details:');
  console.error('Error code:', error.original ? error.original.code : error.code);
  
  if (process.env.DB_DIALECT === 'sqlite') {
    console.error('\nSQLite error. Please check:');
    console.error('1. The database file path is correct and writable');
    console.error('2. The directory for the database file exists');
    console.error(`3. Current database path: ${process.env.DB_STORAGE}`);
  } 
  else if (process.env.DB_DIALECT === 'mysql') {
    if (error.name === 'SequelizeConnectionRefusedError' || 
        (error.original && error.original.code === 'ECONNREFUSED')) {
      console.error('\nCannot connect to MySQL server. Please check:');
      console.error('1. MySQL server is installed and running');
      console.error('2. MySQL server is accessible on the configured host and port');
      console.error('\nOn Windows, you can start MySQL with:');
      console.error('  net start MySQL80 (or your MySQL service name)');
      console.error('\nOn macOS:');
      console.error('  brew services start mysql');
      console.error('\nOn Linux:');
      console.error('  sudo systemctl start mysql');
    }
    else if (error.name === 'SequelizeAccessDeniedError' || 
            (error.original && error.original.code === 'ER_ACCESS_DENIED_ERROR')) {
      console.error('\nAccess denied. Please check:');
      console.error('1. Username and password in your .env file are correct');
      console.error('2. The specified user has permission to access the database');
    }
    else if (error.name === 'SequelizeDatabaseError' ||
            (error.original && error.original.code === 'ER_BAD_DB_ERROR')) {
      console.error('\nDatabase does not exist. Please run:');
      console.error('  npm run setup-db');
      console.error('\nThis will create the database and populate it with initial data.');
    }
  }
  else {
    console.error('\nUnhandled database error. Please check your configuration.');
    console.error('Error details:', error.message);
  }
  
  const dbPassword = getDbPassword();
  
  console.error('\nYour current database configuration:');
  console.error(`  DB_DIALECT: ${process.env.DB_DIALECT}`);
  
  if (process.env.DB_DIALECT === 'sqlite') {
    console.error(`  DB_STORAGE: ${process.env.DB_STORAGE}`);
  } else {
    console.error(`  DB_HOST: ${process.env.DB_HOST}`);
    console.error(`  DB_PORT: ${process.env.DB_PORT}`);
    console.error(`  DB_NAME: ${process.env.DB_NAME}`);
    console.error(`  DB_USER: ${process.env.DB_USER}`);
    console.error(`  DB_PASSWORD: ${dbPassword ? '[SET]' : '[EMPTY]'}`);
  }
}

// Database connection and server start
const startServer = async () => {
  try {
    // Log database connection details
    console.log('Database connection details:');
    console.log(`- Dialect: ${process.env.DB_DIALECT}`);
    
    if (process.env.DB_DIALECT === 'sqlite') {
      console.log(`- Storage: ${process.env.DB_STORAGE}`);
      // Ensure the directory for the SQLite database exists
      const dbDir = path.dirname(process.env.DB_STORAGE);
      if (dbDir !== '.' && !fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log(`Created directory for SQLite database: ${dbDir}`);
      }
    } else {
      const dbPassword = getDbPassword();
      console.log(`- Host: ${process.env.DB_HOST}`);
      console.log(`- Port: ${process.env.DB_PORT}`);
      console.log(`- Database: ${process.env.DB_NAME}`);
      console.log(`- User: ${process.env.DB_USER}`);
      console.log(`- Password: ${dbPassword ? '[SET]' : '[EMPTY]'}`);
    }
    
    // Test database connection
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
      
      // Sync sequelize models with the database
      await sequelize.sync({ alter: true });
      console.log('Database synced successfully');
    } catch (dbError) {
      console.error('Unable to connect to the database:');
      printDBError(dbError);
      
      if (process.env.DB_DIALECT === 'mysql' && 
          dbError.name === 'SequelizeDatabaseError' && 
          dbError.original && dbError.original.code === 'ER_BAD_DB_ERROR') {
        console.log('\nAttempting to create database...');
        // Use raw query to create database
        const createDbInstance = new sequelize.Sequelize({
          host: process.env.DB_HOST,
          dialect: process.env.DB_DIALECT,
          username: process.env.DB_USER,
          password: getDbPassword(),
        });
        
        try {
          await createDbInstance.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
          console.log(`Database '${process.env.DB_NAME}' created successfully`);
          // Retry connection after database creation
          await sequelize.authenticate();
          await sequelize.sync({ alter: true });
          console.log('Database synced successfully after creation');
        } catch (createError) {
          console.error('Failed to create database:');
          printDBError(createError);
          throw createError;
        }
      } else {
        throw dbError;
      }
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API is available at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    
    // Retry connection after delay if in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Retrying in 5 seconds...');
      setTimeout(startServer, 5000);
    }
  }
};

// Create uploads directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
  console.log('Created uploads directory');
  
  // Create subdirectories
  const subdirs = ['products', 'categories', 'users'];
  subdirs.forEach(dir => {
    const dirPath = path.join(__dirname, 'uploads', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
      console.log(`Created ${dir} uploads directory`);
    }
  });
}

startServer(); 