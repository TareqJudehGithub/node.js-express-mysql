const {Sequelize} = require("sequelize");
const sequelize = require("../util/database");

const CartItem = sequelize.define("cartItem", {
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

module.exports = CartItem;