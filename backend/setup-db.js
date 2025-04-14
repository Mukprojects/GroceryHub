const { execSync } = require('child_process');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Helper function to read password from file if DB_PASSWORD_FILE is set
function getDbPassword() {
  if (process.env.DB_PASSWORD_FILE && fs.existsSync(process.env.DB_PASSWORD_FILE)) {
    return fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8').trim();
  }
  return process.env.DB_PASSWORD || '';
}

async function checkMySQLConnection() {
  const {
    DB_HOST = 'localhost',
    DB_USER = 'root',
    DB_PORT = '3306'
  } = process.env;
  
  const DB_PASSWORD = getDbPassword();

  return new Promise((resolve, reject) => {
    console.log(`Checking MySQL connection at ${DB_HOST}:${DB_PORT}...`);
    
    const connection = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: parseInt(DB_PORT, 10),
      connectTimeout: 5000, // 5 second timeout
    });
    
    connection.connect((err) => {
      if (err) {
        connection.end();
        reject(err);
        return;
      }
      
      connection.end();
      resolve(true);
    });
  });
}

async function setupDatabase() {
  const {
    DB_HOST = 'localhost',
    DB_USER = 'root',
    DB_NAME = 'grocery_db_dev',
    DB_PORT = '3306'
  } = process.env;
  
  const DB_PASSWORD = getDbPassword();

  console.log('Starting database setup...');
  
  // Step 0: Check MySQL connection
  try {
    await checkMySQLConnection();
    console.log('Successfully connected to MySQL server!');
  } catch (error) {
    console.error('\nFailed to connect to MySQL server:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\nIt appears the MySQL server is not running. Please make sure:');
      console.error('1. MySQL is installed on your system');
      console.error('2. The MySQL service is started');
      console.error('3. Your credentials in .env file are correct');
      
      console.error('\nOn Windows, you can start MySQL with:');
      console.error('  net start MySQL80 (or your MySQL service name)');
      
      console.error('\nOn macOS, you can start MySQL with:');
      console.error('  brew services start mysql');
      
      console.error('\nOn Linux, you can start MySQL with:');
      console.error('  sudo systemctl start mysql');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nAccess denied. Please check your MySQL username and password in the .env file.');
      console.error('Current configuration:');
      console.error(`- Host: ${DB_HOST}`);
      console.error(`- User: ${DB_USER}`);
      console.error(`- Password: ${DB_PASSWORD ? '[SET]' : '[EMPTY]'}`);
    }
    
    process.exit(1);
  }
  
  // Step 1: Create the database if it doesn't exist
  try {
    console.log(`\nCreating database '${DB_NAME}' if it doesn't exist...`);
    
    // Create connection without database specified
    const connection = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: parseInt(DB_PORT, 10)
    });
    
    // Create the database if it doesn't exist
    await new Promise((resolve, reject) => {
      connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`, (err) => {
        if (err) {
          connection.end();
          reject(err);
          return;
        }
        connection.end();
        resolve();
      });
    });
    
    console.log(`Database '${DB_NAME}' ensured.`);
  } catch (error) {
    console.error('\nError creating database:', error.message);
    process.exit(1);
  }
  
  // Step 2: Run migrations
  try {
    console.log('\nRunning database migrations...');
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('\nError running migrations:', error.message);
    process.exit(1);
  }
  
  // Step 3: Seed the database
  try {
    console.log('\nSeeding the database with initial data...');
    execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('\nError seeding database:', error.message);
    process.exit(1);
  }
  
  console.log('\nDatabase setup completed successfully!');
  console.log('\nYou can now start the server with:');
  console.log('  npm run dev');
}

setupDatabase().catch(err => {
  console.error('\nDatabase setup failed:', err);
  process.exit(1);
}); 