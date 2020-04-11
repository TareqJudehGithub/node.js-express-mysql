//imports:
const Product = require("../models/products");
const Cart = require("../models/cart");

//users routes:
exports.getProducts = (req, res, next) => {
     Product.findAll({
          // order: Sequelize.col("price")
          order: [
               ["id", "ASC"]            
          ]
     })
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
     let fetchedCart;
     let newQuantity = 1;

     //accessing the cart:
     req.user
     .getCart()
     .then(cart => {
          //retreiving single product by ID:
          fetchedCart = cart;
     //if the item is already in cart, then we need to increase it's
     //quantity by 1
          return cart.getProducts({where: {id: prodId} });     
     })
     .then(products => {
          let product;
//if we have product already in cart:
          if (products.length > 0) {
               //show that product in the cart:
               product = products[0]     
          }
          //quantity of the item either remain 1, or increased by 1:
          if(product) {
               //..we need to increase the quantity in case we already 
               //have a product:
               const currentQuantity = product.cartItem.quantity;
               newQuantity = currentQuantity +1;
               return product;
          }
     //if we don't have that product in cart, add it:
          //find the product by id:
          return Product.findByPk(prodId)
     })
     .then(product => {
     //product holds both the item to be added and the quantity.
     //addProduct() is s Sequelize method for many to many relationship,
     //we can add a product in addProduct.
     //in through: {} we add more fields from Cart table (like quantity field)
          //adding item to the cart:
               //1.we fetch the cart
               //2.add product 
          console.log(`Item ${product.title} is now in the cart.`);
          return fetchedCart.addProduct(product, {
               through: {quantity: newQuantity}
               })
            
     })
     .then(() => {
          res.redirect("/cart");
     })
     .catch(err => console.log(err));
     
   };
   // Cart.addProduct(prodId, product.price, product.imageUrl);
     // console.log(`Item ${product.title} is now in the cart.`) 
     // res.redirect("/cart");

//Delete product
exports.postCartDeleteProduct = (req, res, next) => {
     const prodId = req.body.id;
     const title = req.body.title;
     //get cart for the current user:
     req.user.getCart()
     .then(cart => {
          return cart.getProducts({ where: {id: prodId }})
     })
     .then(products => {
          //fetch the product to be deleted:
          const product = products[0];
          console.log( product.title + " was succeffully deleted.")
          //delete the product:
          return product.cartItem.destroy();
     })
     .then(result => {
          res.redirect("/cart");
     })
     .catch(err => console.log(err));
     
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


 
 
 