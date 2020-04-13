const shopController = require("../controllers/shop");

const express = require("express");
const router = express.Router();   

//routes:
router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);

//route with a dynamic segment. Always sort it in the botton.
router.get("/products/:id", shopController.getProductById)
router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);
router.post("/cart-delete-item", shopController.postCartDeleteProduct);
router.get("/orders", shopController.getOrders);
router.post("/create-order", shopController.postOrder);


module.exports = router;