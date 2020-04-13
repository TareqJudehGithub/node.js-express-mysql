const { Sequelize } = require("sequelize");
const sequelize = require("../util/database");

const OrderItem = sequelize.define("orderItem", {
     id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
     },
     quantity: {
          type: Sequelize.INTEGER
         
     },
     // title: {
     //      type: Sequelize.STRING,
        
     // },
     
     // price: {
     //      type: Sequelize.DOUBLE
        
     // },
     // imageUrl: {
     //      type: Sequelize.STRING
     // }
});
module.exports = OrderItem;