require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  logging: process.env.NODE_ENV === 'development',
};
