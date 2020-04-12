//core modules
const path = require("path");

//Express Server setup
const express = require("express");
const app = express();

//database connection pool:
const sequelize = require("./util/database");
const Product = require("./models/products");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

//EJS 1. setup:
app.set("view engine", "ejs");
app.set("views", "views"); //for the views folder

//Routes:
const adminRoute = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/404");

//middlwares:
app.use(express.urlencoded( {extended: false }));
app.use((req, res, next) => {
     //retreiving user by ID from MySQL db:
     User.findByPk(1)
     .then(user => {
          req.user = user;
          //if we fetched the user (by ID), and stored it in the db, we can then call next():
          next();
     })
     .catch(err => console.log(err))
});

//static files path: to grant access to other folders:
app.use(express.static(path.join(__dirname, "/public")));

//end-points:
app.use(adminRoute);
app.use(shopRoutes);

//Error page not found for undefined routes.
app.use(errorController.get404);


//table relations in MySql:
Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
//One user has many products (one to many relationship):
User.hasMany(Product);
//one to one relationship:
User.hasOne(Cart);
//through: to tell Sequelize where these connections should be stored.
Cart.belongsToMany(Product, { through: CartItem }); //cart.getProduct()
//an Order belongs to one user:
Order.belongsTo(User);   
//A user has many orders  (one to many):
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem }); //order.getProduct()

//Creating table in MYSQL using Sequelize:
// sequelize.sync({force: true})
sequelize.sync()
.then(result => {
     //if we already have a user:
     return User.findByPk(1);
})
.then(user => {
     //if we don't have a user:
     if (!user) {
          return User.create({ name: "John", email: "john@email.com"});
     }
     return Promise.resolve(user);
})
.then(user => {
     // console.log(user);
     return user.createCart()
.then(cart => {
     app.listen(4000, () => {
          app.listen()
          ?
          console.log("Server is up and running on PORT 4000!")
          :
          console.log("Error starting Express server.")
     });
})
})
.catch(err => console.log(err));


