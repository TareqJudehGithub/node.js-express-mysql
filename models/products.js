//imports:
const fs = require("fs");
const path = require("path");
const Cart = require("./cart");


const p = path.join(
     path.dirname(process.mainModule.filename), 
     "data", 
     "products.json"
);

// cb callback executes once it's done reading the file:
const getProductsFromFile = (cb) => {
    
     fs.readFile(p, (err, fileContent) => {
          if(err) {
              return cb([])
          }
          //to return items in products.json as an array and not text:
          cb(JSON.parse(fileContent));
     });
}

module.exports = class Product {
     constructor(id, title, imageUrl, price, description) {
          this.id = id;
          this.title = title;
          this.imageUrl = imageUrl;
          this.price = price;
          this.description = description;
          
     };
     
     save() {
          //creating new id property 
          getProductsFromFile(products => {
               if (this.id) {
                    const existingProductIndex = products.findIndex(prod =>
                         prod.id === this.id);
                    const updatedProducts = [...products];
                    updatedProducts[existingProductIndex] = this;
                    //replacing the old items contents with the edited ones:
                    fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                         console.log(err);
                    });   
               }
               else{
                    this.id = Math.floor(Math.random()*1000 +1).toString();
                    products.push(this);
                    fs.writeFile(p, JSON.stringify(products), err => {
                         console.log(err);
                    })
               };
          });     
     };

     static deleteById(id) {
         getProductsFromFile(products => {
              //extracting the product (to fetch price for Cart.deleteProdcut below),
               //before removal:
              const product = products.find(item => item.id === id);
               
              //del item by Id
              const updatedProducts = products.filter(item => 
               item.id !== id
               );
               if(updatedProducts){
                    console.log(`deleting item ${product.title} from Shop.`)
               }
              fs.writeFile(p, JSON.stringify(updatedProducts), err => {
               if(!err){
                    //del item also from the Cart, and also update the cart total price:
                    Cart.deleteProduct(id, product.price);  
                    console.log(`deleting item ${product.title} from cart.`)              
                }      
              });
         });   
     };
     //calling Product class directly:
     static fetchAll(cb) {
        getProductsFromFile(cb);
     };

     static findById(id, cb) {   // id: get an id as an arguement,
     //and a cb which will be executed right after finding a product.
     getProductsFromFile(products => {
          const product = products.find(item =>  item.id === id);
          cb(product);
     });
     };
};
