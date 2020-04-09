//core modules
const path = require("path");

//Express Server setup
const express = require("express");
const app = express();

//database connection pool:
const sequelize = require("./util/database");

//EJS 1. setup:
app.set("view engine", "ejs");
app.set("views", "views"); //for the views folder

//Routes:
const adminRoute = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/404");

//middlwares:
app.use(express.urlencoded( {extended: false }));

//static files path: to grant access to other folders:
app.use(express.static(path.join(__dirname, "/public")));

//end-points:
app.use(adminRoute);
app.use(shopRoutes);

//Error page not found for undefined routes.
app.use(errorController.get404);

//Creating table in MYSQL using Sequelize:
sequelize.sync()
.then(() => {
     app.listen(4000, () => {
          app.listen()
          ?
          console.log("Server is up and running on PORT 4000!")
          :
          console.log("Error starting Express server.")
     });
})
.catch(err => console.log(err));


