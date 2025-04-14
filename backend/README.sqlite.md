# GroceryHub Backend with SQLite

A Node.js/Express backend with Sequelize ORM for SQLite database.

## Why SQLite?

SQLite is the simplest way to get started with the GroceryHub backend:

- No separate database server installation required
- Works out of the box on all platforms (Windows, macOS, Linux)
- Database stored in a single file, easy to back up
- Ideal for development and testing

## Setup Instructions

### Prerequisites
- Node.js 14+ and npm

### Environment Configuration
Use the existing .env file or create a new one:

```
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development

# SQLite Database Configuration
DB_DIALECT=sqlite
DB_STORAGE=database.sqlite
```

### Installation

1. Install the dependencies:
```
npm install
```

2. Set up the database:
```
npm run setup-sqlite
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

### Database File Location

The SQLite database file will be created at the location specified in the `DB_STORAGE` environment variable. By default, this is `database.sqlite` in the root directory of the backend.

### Switching to MySQL Later

If you need to switch to MySQL later, follow these steps:

1. Install MySQL Server
2. Update your .env file with MySQL configuration:
```
DB_DIALECT=mysql
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=grocery_db_dev
DB_PORT=3306
```
3. Run the MySQL setup script:
```
npm run setup-db
``` 