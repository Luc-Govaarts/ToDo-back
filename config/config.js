require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: "postgres",
    operatorsAliases: "0"
  }
}