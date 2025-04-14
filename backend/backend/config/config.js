require('dotenv').config({ path: '../../.env' });
const fs = require('fs');
const path = require('path');

// Helper function to read password from file if DB_PASSWORD_FILE is set
function getDbPassword() {
  if (process.env.DB_PASSWORD_FILE && fs.existsSync(process.env.DB_PASSWORD_FILE)) {
    return fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8').trim();
  }
  return process.env.DB_PASSWORD || '';
}

const password = getDbPassword();

// Base configuration
const baseConfig = {
  dialect: process.env.DB_DIALECT || 'sqlite',
};

// Add database-specific configuration
if (process.env.DB_DIALECT === 'sqlite') {
  baseConfig.storage = process.env.DB_STORAGE || 'database.sqlite';
} else {
  baseConfig.username = process.env.DB_USER || 'root';
  baseConfig.password = password;
  baseConfig.host = process.env.DB_HOST || '127.0.0.1';
  baseConfig.port = process.env.DB_PORT || 3306;
  
  if (process.env.DB_DIALECT === 'mysql') {
    baseConfig.database = process.env.DB_NAME || 'grocery_db_dev';
  } else if (process.env.DB_DIALECT === 'postgres') {
    baseConfig.database = process.env.DB_NAME || 'grocery_db_dev';
  }
}

module.exports = {
  development: {
    ...baseConfig,
    logging: console.log,
  },
  test: {
    ...baseConfig,
    database: process.env.DB_DIALECT !== 'sqlite' ? 
      (process.env.DB_NAME_TEST || 'grocery_db_test') : undefined,
    storage: process.env.DB_DIALECT === 'sqlite' ? 
      (process.env.DB_STORAGE_TEST || 'database.test.sqlite') : undefined,
    logging: false,
  },
  production: {
    ...baseConfig,
    database: process.env.DB_DIALECT !== 'sqlite' ? 
      process.env.DB_NAME : undefined,
    storage: process.env.DB_DIALECT === 'sqlite' ? 
      (process.env.DB_STORAGE || 'database.production.sqlite') : undefined,
    logging: false,
    dialectOptions: process.env.DB_SSL === 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : undefined
  }
}; 