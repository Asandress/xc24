require('dotenv').config();

const DB_USER = process.env.NODE_ENV === 'production' ? process.env.DB_USER : process.env.DEV_DB_USER
const DB_PASS = process.env.NODE_ENV === 'production' ? process.env.DB_PASS : process.env.DEV_DB_PASS
const DB_NAME = process.env.NODE_ENV === 'production' ? process.env.DB_NAME : process.env.DEV_DB_NAME
module.exports = {
  HOST: "localhost",
  USER: DB_USER,
  PASSWORD: DB_PASS,
  DB: DB_NAME,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};