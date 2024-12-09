require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: '123456',
    database: 'wallpaper_db',
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_DATABASE}_test`,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_DATABASE}_prod`,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};
