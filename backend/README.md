# GroceryHub Backend

A Node.js/Express backend with Sequelize ORM for MySQL database.

## Setup Instructions

### Prerequisites
- Node.js 14+ and npm
- MySQL server running locally

### Installing MySQL

#### Windows
1. Download MySQL Installer from the [official website](https://dev.mysql.com/downloads/installer/)
2. Run the installer and follow the installation wizard
3. During installation, set your root password (remember it for configuration)
4. Make sure the MySQL service is running:
   ```
   net start MySQL80
   ```
   (MySQL80 is the default service name, yours might differ)

#### macOS
Using Homebrew:
```
brew install mysql
brew services start mysql
```

#### Ubuntu/Debian
```
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### Environment Configuration
Copy the example environment file and configure it:

```
cp .env.example .env
```

Update the `.env` file with your MySQL credentials:
```
DB_DIALECT=mysql
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=grocery_db_dev
DB_PORT=3306
```

### Installation

1. Install the dependencies:
```
npm install
```

2. Set up the database (creates the database, runs migrations, and seeds initial data):
```
npm run setup-db
```

If you encounter errors with MySQL connection, make sure:
- MySQL server is installed and running
- Your MySQL credentials in the `.env` file are correct
- The MySQL port is correct (default is 3306)

Alternatively, you can run these steps manually:
```
npm run db:create          # Create the database
npm run db:migrate         # Run migrations
npm run db:seed            # Seed initial data
```

### Running the Server

Development mode with auto-restart:
```
npm run dev
```

Production mode:
```
npm start
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product by ID
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category by ID
- `POST /api/categories` - Create a new category (admin only)
- `PUT /api/categories/:id` - Update a category (admin only)
- `DELETE /api/categories/:id` - Delete a category (admin only)

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

#### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/myorders` - Get logged in user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Update order to delivered (admin only)
- `GET /api/orders` - Get all orders (admin only)

#### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart 