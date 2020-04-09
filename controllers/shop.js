//imports:
const Product = require("../models/products");
const Cart = require("../models/cart");

//users routes:
exports.getProducts = (req, res, next) => {
     
     //to fetch/get all products:
     Product.fetchAll((products) => {
          res.render(
               "shop/product-list.ejs",
               {
                    prods: products,
                    pageTitle: "Products List", 
                    path: "/products"
               }); 
     }); 
};
 exports.getProductById = (req, res, next) => {
  //* The name we use after params is the name we used
     //in the route in /routes/shop.js
     const prodId = req.params.id;
     Product.findById(prodId, product => {
          res.render(
               "shop/product-detail.ejs",
               {
                    product: product,
                    pageTitle: product.title,
                    path: "/products"         
               });
          console.log(product.price);
     });
 };
 exports.getIndex = (req, res, next) => {
     Product.fetchAll(products => {
          res.render(
               "shop/index.ejs",
               {
                    prods: products,
                    pageTitle: "Shop",
                    path: "/"
                    
               });
     });
 };
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
exports.postCart = (req, res, next) => {
     const prodId = req.body.Id;
     Product.findById(prodId, product => {
     Cart.addProduct(prodId, product.price, product.imageUrl);
     console.log(`Item ${product.title} is now in the cart.`)
      }); 
     res.redirect("/cart");
   };
 
exports.postCartDeleteProduct = (req, res, next) => {
     const prodId = req.body.id;
     //get price from product.js:
     Product.findById(prodId, product => {
          Cart.deleteProduct(prodId, product.price);
     });
     res.redirect("/cart");
};
   
exports.getOrders = (req, res, next) => {
     res.render(
          "shop/orders.ejs",
          {
              pageTitle: "Orders",
              path: "/orders",     
          })
};
exports.getCheckout = (req, res, next) => {
     res.render(
          "shop/checkout.ejs",
          {
              pageTitle: "Checkout",
              path: "/checkout",     
          })
}

 
 
 