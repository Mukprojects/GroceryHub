# GroceryHub

![GroceryHub Logo](https://groceryhub1.netlify.app/logo.png)

## 🛒 Live Demo

[Visit GroceryHub](https://groceryhub1.netlify.app)

## 📝 Description

GroceryHub is a full-stack e-commerce application for online grocery shopping, built using React for the frontend and Node.js/Express for the backend with a MySQL database (SQLite in development). The platform allows customers to browse products, add items to cart, place orders, manage their profiles, and track order status. It also includes an admin panel for managing products, categories, and orders.

## ✨ Features

- **User Authentication**: Secure login/signup with JWT authentication
- **Product Catalog**: Browse products by categories with search, sort, and filter options
- **Product Reviews**: Leave ratings and reviews for products
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout Process**: Multiple payment options with order summary
- **Order Management**: View and track order status
- **User Profile**: Update personal information and view order history
- **Admin Dashboard**: Comprehensive management of products, categories, orders, and users
- **Responsive Design**: Mobile-friendly interface for shopping on any device

## 🛠️ Tech Stack

### Frontend
- React.js
- Redux for state management
- Styled Components for styling
- React Router for navigation
- React Icons for UI elements

### Backend
- Node.js with Express
- Sequelize ORM for database management
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing

### Database
- MySQL (Production)
- SQLite (Development)

## 🚀 Installation and Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MySQL (for production)

### Clone Repository
\\\ash
git clone https://github.com/Mukprojects/GroceryHub.git
cd GroceryHub
\\\

### Backend Setup
\\\ash
cd backend
npm install
# Configure environment variables in .env file
npm run dev
\\\

### Frontend Setup
\\\ash
cd frontend
npm install
npm start
\\\

## 📊 Database Schema

The application uses the following main database tables:
- Users
- Products
- Categories
- Reviews
- Carts & CartItems
- Orders & OrderItems

## 👥 Contributors

- [Your Name](https://github.com/yourusername)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React Icons](https://react-icons.github.io/react-icons/)
- [Styled Components](https://styled-components.com/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Netlify](https://www.netlify.com/) for hosting the frontend

---

© 2023 GroceryHub. All Rights Reserved.
