//Sequalize connection setup:

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
     "nodedb", "root", "password", {
          dialect: "mysql",
          host: "localhost",    
     });
     
//Testing Sequelize connection to MYSQL DB
sequelize
.authenticate()
.then(() => {
     console.log('Connection has been established successfully.');
})
.catch(err => {
     console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;
