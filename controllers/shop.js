//imports:
const Product = require("../models/products");
const Cart = require("../models/cart");

//users routes:
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
  //* The value we use after params is the value we used
     //in the route in /routes/shop.js   (/products/:id)
     const prodId = req.params.id;
     // Product.findOne({where: { id: prodId }})
     // OR: 
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
               })
     
          })
     .catch(err => {console.log(err)});
 };
 //Cart
 exports.getCart = (req, res, next) => {
     //fetching cart from db:
     req.user
     .getCart()
     .then(cart => {
     //fetching products inside the cart from db: Cart.belongsTomany(Product, {through: CartItem});
          return cart.getProducts()
          //products available in cart and rendering them to page /cart:
          .then(product => {
               res.render(
                    ("shop/cart.ejs"),
                    {
                         products: product,
                         pageTitle: "Shopping Cart",
                         path: "/cart"
                    });
          }) 
          .catch(err => console.log(err));
     })
     .catch(err => console.log(err));
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

exports.getCheckout = (req, res, next) => {
     res.render(
          "shop/checkout.ejs",
          {
              pageTitle: "Checkout",
              path: "/checkout",     
          })
}
exports.getOrders = (req, res, next) => {
     res.render(
          "shop/orders.ejs",
          {
              pageTitle: "Orders",
              path: "/orders",     
          })
};


 
 
 