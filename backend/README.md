# Wallpaper E-commerce Backend

A Node.js backend for a wallpaper and home decor e-commerce platform.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication

## Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL
- npm

## Installation

1. Clone the repository
    ```bash
    git clone https://github.com/yourusername/your-repo-name.git
    ```
2. Install dependencies
    ```bash
    npm install
    ```
3. Create a .env file in the root directory and add your environment variables:
    ```plaintext
    PORT=8000
    NODE_ENV=development
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    JWT_SECRET=your_jwt_secret
    ```
4. Run database migrations
    ```bash
    npm run db:migrate
    ```
5. Run seeder (if any)
6. Start the server
    ```bash
    npm run dev
    ```

## API Documentation

1. Authentication
    ```plaintext
    POST /api/users/register
    POST /api/users/login
    ```
2. Categories
    ```plaintext
    GET /api/categories
    POST /api/categories
    PUT /api/categories/:id
    DELETE /api/categories/:id
    ```
3. Products
    ```plaintext
    GET /api/products
    POST /api/products
    PUT /api/products/:id
    DELETE /api/products/:id
    ```