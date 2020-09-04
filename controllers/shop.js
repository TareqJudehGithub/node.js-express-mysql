//imports:
const Product = require("../models/products");

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
     //cart
     .then(cart => {       
          fetchedCart = cart;   
          return cart.getProducts({where: {id: prodId} });     
     })
     .then(products => {
          let product;

          if (products.length > 0) {
               product = products[0]     
          }     
          if(product) {            
               const currentQuantity = product.cartItem.quantity;
               newQuantity = currentQuantity +1;
               return product;
          } 
          return Product.findByPk(prodId)
     })
     .then(product => {
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

//Delete product
exports.postCartDeleteProduct = (req, res, next) => {
     const prodId = req.body.id;
     //get cart for the current user:
     req.user.getCart()
     .then(cart => {
          return cart.getProducts({ where: {id: prodId }})
     })
     .then(products => {
          //fetch the product to be deleted:
          const product = products[0];
          console.log( product.title + " was successfully deleted.");
          //delete the product:
          return product.cartItem.destroy();
     })
     .then(result => {
          res.redirect("/cart");
     })
     .catch(err => console.log(err));
  
};

//move all cart items into postOrder
exports.postOrder = (req, res, next) => {
   
     let fetchedCart;
     req.user
     //access to the cart:
     .getCart()
     .then(cart => {
          fetchedCart = cart;

          //must use return, to associate products to this order:
          return cart.getProducts()
     })
     //access to the cart, we get access to the products by default:
     .then(products => {
          return req.user
          .createOrder()
          .then(order => {
               //associating products to this order:
               //adding the product and it's quantity to the order:           
               return order.addProducts(
                    products.map(product => {
                    //to include product qty field in orderItem table:

//.map(element).(order-item table name: orderItem) = {column name(value): quantity: (products model name.table name. column name)};
                    product.orderItem = { 
                         quantity: product.cartItem.quantity
                     };
                    return product;
               }))
          })  
          .catch(err => console.log("Error order" + err));   
     })
     .then(result => {
          //clearing cart after placing an order:
          return fetchedCart.setProducts(null);
          // console.log(productName +  " was added successfully to Order.")
          
     })
     .then(result => {
          res.redirect("/orders");
     })
     .catch(err => console.log("Error products: " + err));
}

exports.getOrders = (req, res, next) => {
     req.user
     .getOrders({include: ["products"]})
     .then(orders => {
          res.render(
               "shop/orders.ejs",
               {
                    orders: orders,
                    pageTitle: "Orders",
                    path: "/orders",     
               })
     })
     .catch(err => console.log("Error getOrders: " + err));
};



 
 
 