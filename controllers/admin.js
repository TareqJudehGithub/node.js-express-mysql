//imports:
const Product = require("../models/products");

//Add product by Admin
     //Add Product page
exports.getAddProduct = (req, res, next) => {

    Product.findAll()
         .then(products => {
              res.render(
                   "admin/edit-product.ejs",
                   {
                        pageTitle: "Add new product",
                        path: "/admin/add-product",
                        prods: products,
                        editing: false,
                   });          
         })
         .catch(err => console.log(err)); 
};
     //Add Product page
exports.postAddProduct = (req, res, next) => {
     
     const { title, price, imageUrl, description } = req.body;

     req.user
     .createProduct({  
          title: title,
          price: price,
          imageUrl: imageUrl,
          description: description
     }) 
     .then(result => {
          res.redirect("/admin/products");
          console.log(result.title +  " adding was successful!")
     })
     .catch(err => console.log(err));
};

  exports.getEditProduct = (req, res, next) => {
    
     //fetching the product using name id set in the 
     //admin.js routes for getEditProduct:
     const prodId = req.params.id;

     // Product.findByPk(prodId) OR:
     //find the right product ID, for the current user:
     req.user
     .getProducts({where: {id: prodId}})
     
     
     .then(product => {
          
          res.render(
               "admin/edit-product.ejs",
               {
                    pageTitle: "Edit product",
                    path: "/admin/edit-product",
                    editing: true,
                    product: product[0]
               });
     })
     .catch(err => console.log(err)); 
  };

//construct a new produt by editing (replacing) the original product:
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
         console.log(result.title + " update was successful!");
         res.redirect("/admin/products");
         })
    .catch(err => console.log(err));
  };
 
  exports.getAdminProducts = (req, res, next) => {
     // get all products for the current user:
     req.user.getProducts()
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