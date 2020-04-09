//importing class Product from /modules folder:
const Product = require("../models/products");
const Cart = require("../models/cart");


//admin routes:
exports.postAddProduct = (req, res, next) => {
     
     // const id = req.body.id;
     const title = req.body.title;
     const imageUrl = req.body.imageUrl;
     const price = req.body.price;
     const description = req.body.description;
     
     const product = new Product(null, title, imageUrl, price, description);
 
     product.save(); //this will call the save() we defined in /models/products.
     res.redirect("/");
};

exports.getAddProduct = (req, res, next) => {

      res.render(
           "admin/edit-product.ejs",
           {  
               pageTitle: "Add Product",  
               path: "/admin/add-product",
               editing: false 
          });
 };

  exports.getEditProduct = (req, res, next) => {
     const editMode =req.query.edit;
     if(!editMode){
          return res.redirect("/");
     }
     //fetching the product using name id set in the 
     //admin.js routes for getEditProduct:
     const prodId = req.params.id;
     Product.findById(prodId, product => {
          if (!product) {
               return res.redirect("/");
          }
          res.render(
               "admin/edit-product.ejs",
               {
                    pageTitle: "Edit product",
                    path: "/admin/edit-product",
                    editing: editMode,
                    product: product
               });
     })
  };
//construct a new produt by editing (replacing) the original product:
  exports.postEditProduct = (req, res, next) => {
       const { id, title, imageUrl, price, description } = req.body;
     
//passing prodId will ensure in the model/product.js, in getProductsFromFile,
// we will fetch the right ID from if statement(updating mode):
     const updatedProduct = new Product(id, title, imageUrl, price, description);
     updatedProduct.save();
     res.redirect("/admin/products");
     console.log("Product update was successful!");
     console.log(prodId);
  };
 
  exports.getAdminProducts = (req, res, next) => {
       Product.fetchAll(products => {
            res.render(
                 "admin/products.ejs",
                 {
                    pageTitle: "Admin Products",
                    path: "/admin/products",
                    prods: products
                 });
       });
  };

exports.postDeleteProduct = (req, res, next) => {
     const prodId = req.body.id;
     Product.deleteById(prodId);
    
     res.redirect("/admin/products");
     
};