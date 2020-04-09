//imports:
const Product = require("../models/products");
const Cart = require("../models/cart");

//users routes:

//Products page
exports.getProducts = (req, res, next) => {
     Product.findAll()
          .then(products => {
               res.render(
                    "shop/product-list.ejs",
                    {
                         prods: products,
                         pageTitle: "Products List",
                         path: "/products"
                    });
               })
               .catch(err => console.log("Products List Error!", err));
};

//Product details:
exports.getProductById = (req, res, next) => {
     const prodId = req.params.id;
     // Product.findAll({where: { id: prodId }}) OR: 
     Product.findByPk(prodId)
          .then((product) => {
               res.render(
                    "shop/product-detail.ejs",
                    {
                         product: product,
                         pageTitle: "Product Details",
                         path: "/products"
                    }
               );
          })
          .catch(err => console.log(err));
};
//Shop (main page)
 exports.getIndex = (req, res, next) => {
     Product.findAll()
     .then(products => {
          res.render(
               "shop/index.ejs",
               {
                    prods: products,
                    pageTitle: "Shop",
                    path: "/"
               });
     })
     .catch(err => {console.log(err)});
 };

 //Cart
 exports.getCart = (req, res, next) => {
     Cart.getCart(cart => {   //test if this is the same cart var in cart.js
          //fetch all products
          Product.fetchAll(products => {
               const cartProducts = [];
               products.map(product =>  {
                    const cartProductData = cart.products.find(prod => 
                         prod.id === product.id);
                    //check for the item in cart exists or not:
                    if(cartProductData) {
                         //add the product i'm looking for:
                         cartProducts.push({ 
                              productData: product, 
                              qty: cartProductData.qty });
                         }
                   
               //afte this, i'll have an array of products,
               //which are in the cart:
               })
               res.render(
                    "shop/cart.ejs",
                    {
                        pageTitle: "Cart",
                        path: "/cart",    
                        products: cartProducts 
                    });
          });   
     });
 };
//Add to Cart
exports.postCart = (req, res, next) => {
     const prodId = req.body.Id;
     Product.findById(prodId, product => {
     Cart.addProduct(prodId, product.price, product.imageUrl);
     console.log(`Item ${product.title} is now in the cart.`)
      }); 
     res.redirect("/cart");
   };
 
//Delete product
exports.postCartDeleteProduct = (req, res, next) => {
     const prodId = req.body.id;
     //get price from product.js:
     Product.findById(prodId, product => {
          Cart.deleteProduct(prodId, product.price);
     });
     res.redirect("/cart");
};
//Checkout page
exports.getCheckout = (req, res, next) => {
     res.render(
          "shop/checkout.ejs",
          {
              pageTitle: "Checkout",
              path: "/checkout",     
          })
};
//Orders history
exports.getOrders = (req, res, next) => {
     res.render(
          "shop/orders.ejs",
          {
              pageTitle: "Orders",
              path: "/orders",     
          })
};


 
 
 