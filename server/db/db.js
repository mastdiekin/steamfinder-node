const Sequelize = require("sequelize").Sequelize;
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/database.json")[env];

const sequelize = new Sequelize(config);

module.exports = sequelize;
