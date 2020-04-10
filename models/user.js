//imports:
const { Sequelize } = require("sequelize");
const sequelize = require("../util/database");

//Modeling tables:
const User = sequelize.define("user", {
     id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
     },
     name: {
          type: Sequelize.STRING,
          allowNull: false
     },
     email: {
          type: Sequelize.STRING,
          allowNull: false
     }
});

module.exports = User;