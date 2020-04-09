//imports:
const Product = require("../models/products");

//admin routes:

//Add product by Admin
exports.postAddProduct = (req, res, next) => {
     
     const title = req.body.title;
     const price = req.body.price;
     const imageUrl = req.body.imageUrl;
     const description = req.body.description;
     //saves immediately to MySQL DB:
     Product.create({
          title: title,
          price: price,
          imageUrl: imageUrl,
          description: description,
          
     })
     .then(result => {
          res.redirect("/admin/products");
          console.log(result +  "adding was successful!")
     })
     .catch(err => console.log(err));
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
     Product.findByPk(prodId)
          .then(product => {
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
          .catch(err => console.log(err)); 
  };


  exports.postEditProduct = (req, res, next) => {
       const { id, title, imageUrl, price, description } = req.body;
     
     //find the right product ID:
     Product.findByPk(id)
     .then(product => {
          //this will only change the data localy:
          product.title = title,
          product.price = price,
          product.imageUrl = imageUrl,
          product.description = description
          //Now, we save all changes to MySQL db:
          return product.save();
     })
     .then(result => {
          console.log(result + " update was successful!");
          res.redirect("/admin/products");
          })
     .catch(err => console.log(err));
    
  };
 
  exports.getAdminProducts = (req, res, next) => {
       Product.findAll()
       .then(products => {
          res.render(
               "admin/products.ejs",
               {
                  pageTitle: "Admin Products",
                  path: "/admin/products",
                  prods: products
               });
       })
       .catch(err => console.log(err));
  };

exports.postDeleteProduct = (req, res, next) => {
     const prodId = req.body.id;
     Product.findByPk(prodId)
     .then(product => {
          return product.destroy();
     })
    .then(result => {
         res.redirect("/admin/products");
         console.log(result + " deletion was successful!");
    })
    .catch(err => console.log(err));
     
     
};