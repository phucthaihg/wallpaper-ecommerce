// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');  // Changed this line to import from models

/**
 * Initialize express app
 * Khởi tạo ứng dụng express
 */
const app = express();

/**
 * Security middleware configuration
 * Cấu hình middleware bảo mật
 */
app.use(helmet());

/**
 * CORS configuration
 * Cấu hình CORS
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

/**
 * Request parsing middleware
 * Middleware xử lý request
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Logging middleware
 * Middleware ghi log
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * Rate limiting
 * Giới hạn số lượng request
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes / 15 phút
  max: 100 // limit each IP to 100 requests per windowMs / giới hạn mỗi IP 100 request trong khoảng thời gian
});
app.use('/api', limiter);

/**
 * Static files serving
 * Phục vụ file tĩnh
 */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * API Routes
 * Các route API
 */
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/specifications', require('./routes/specification.routes'));
app.use('/api/cart', require('./routes/cart.routes'));

/**
 * Error handling middleware
 * Middleware xử lý lỗi
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error - Lỗi máy chủ',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/**
 * 404 Route handler
 * Xử lý route không tồn tại
 */
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found - Không tìm thấy đường dẫn'
  });
});

/**
 * Database connection and server startup
 * Kết nối database và khởi động server
 */
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Connect to database
    // Kết nối với database
    await sequelize.authenticate();
    console.log('Database connection established - Đã kết nối với database');

    // Sync database (in development)
    // Đồng bộ database (trong môi trường phát triển)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized - Đã đồng bộ database');
    }

    // Start server
    // Khởi động server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} - Server đang chạy trên cổng ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server - Không thể khởi động server:', error);
    process.exit(1);
  }
};

/**
 * Error handling for uncaught exceptions
 * Xử lý lỗi cho các exception không được bắt
 */
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception - Exception không được bắt:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection - Promise rejection không được xử lý:', error);
  process.exit(1);
});

// Start the server
// Khởi động server
startServer();

module.exports = app;