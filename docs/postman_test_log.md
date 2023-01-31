# Postman test log

| Feature  | Route | HTTP Method | Outcome | Comments |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| View all product  | /products  | GET  | Passed  | No issue  |
| View a single product  | /products/:name  | GET  | Passed  | No issue  |
| View all carts  | /carts | GET  | Passed  | No issue |
| View a single cart  | /carts/:cartid  | GET  | Passed  | No issue  |
| Update the quantity of a product in the existing cart  | /carts/:cartid/:name  | POST  | Passed  | No issue |
| Add a new product to an existing cart  | /carts/:cartid/:name  | POST  | Passed  | No issue |
| Create new cart  | /carts/null/:name  | POST  | Passed  | No issue |
| View all order  | /orders  | GET  | Passed  | No issue |
| View a single order  | /orders/:orderid  | GET  | Passed  | No issue |
| Add new address  | /orders/address  | POST  | Passed  | No issue  |
| Create new order  | /orders  | POST  | Passed  | No issue |
| Delete a product from an existing cart  | /carts/:cartid/:name  | DELETE  | Passed  | No issue |
| Delete the cart  | /carts/:cartid  | DELETE  | Passed | No issue  |

## Screenshots of postman

* Summary of routes
  
  ![Summary of routes](postman-testing-screenshot/Summary%20of%20routes.png)

* Get all products
  
  ![Get all products](postman-testing-screenshot/Get%20all%20products.png)

* Get a single product with valid product name
  
  ![Get a single product with valid product name](postman-testing-screenshot/Get%20a%20single%20product%20with%20valid%20product%20name.png)

* Get a single product with invalid product name
  
  ![Get a single product with invalid product name](postman-testing-screenshot/Get%20a%20single%20product%20with%20invalid%20product%20name.png)

* Get all orders
  ![Get all orders](postman-testing-screenshot/Get%20all%20orders.png)
  
* Get a single order with valid order id
  ![Get a single order with valid order id](postman-testing-screenshot/Get%20a%20single%20order%20with%20valid%20order%20id.png)
  
* Get a single order with invalid order id
  ![Get a single order with invalid order id](postman-testing-screenshot/Get%20a%20single%20order%20with%20invalid%20order%20id.png)
  
* Get a single order with order id in wrong format
  ![Get a single order with order id in wrong format](postman-testing-screenshot/Get%20a%20single%20order%20with%20order%20id%20in%20wrong%20format.png)
  
* Get all carts
  ![Get all carts](postman-testing-screenshot/Get%20all%20carts.png)
  
* Get a single cart with valid cart id
  ![Get a single cart with valid cart id](postman-testing-screenshot/Get%20a%20single%20cart%20with%20valid%20cart%20id.png)
  
* Get a single cart with invalid cart id
  ![Get a single cart with invalid cart id](postman-testing-screenshot/Get%20a%20single%20cart%20with%20invalid%20cart%20id.png)
  
* Get a single cart with cartid in wrong format
  ![Get a single cart with cartid in wrong format](postman-testing-screenshot/Get%20a%20single%20cart%20with%20cartid%20in%20wrong%20format.png)

* ![Delete a product from cart](postman-testing-screenshot/Delete%20a%20product%20from%20cart.png)
  
* ![Delete a product from cart with invalid cart id](postman-testing-screenshot/Delete%20a%20product%20from%20cart%20with%20invalid%20cart%20id.png)
  
* ![Delete a product from cart with cartid in wrong format](postman-testing-screenshot/Delete%20a%20product%20from%20cart%20with%20cartid%20in%20wrong%20format.png)
  
* Delete a cart with valid cart id
  ![Delete a cart with valid cart id](postman-testing-screenshot/Delete%20a%20cart%20with%20valid%20cart%20id.png)
  
* Delete a cart with invalid cart id
  ![Delete a cart with invalid cart id](postman-testing-screenshot/Delete%20a%20cart%20with%20invalid%20cart%20id.png)
  
* Delete a cart with cart id in wrong format
  ![Delete a cart with cart id in wrong format](postman-testing-screenshot/Delete%20a%20cart%20with%20cart%20id%20in%20wrong%20format.png)
  
* Update the quantity of existing product in the cart
  ![Update the quantity of existing product in the cart](postman-testing-screenshot/Update%20the%20quantity%20of%20existing%20product.png)
  
* Add new product to the existing cart
  ![Add new product to the existing cart](postman-testing-screenshot/Add%20new%20product%20to%20the%20existing%20cart.png)
  
* Add products to a cart with cartid in the wrong format
  ![Add products to a cart with cartid in the wrong format](postman-testing-screenshot/Add%20products%20to%20a%20cart%20with%20cartid%20in%20the%20wrong%20format.png)
  
* Add products to a cart with invalid cart id
  ![Add products to a cart with invalid cart id](postman-testing-screenshot/Add%20products%20to%20a%20cart%20with%20invalid%20cart%20id.png)
  
* Create a new cart with product
  ![Create a new cart with product](postman-testing-screenshot/Create%20a%20new%20cart%20with%20product.png)
  
* Add new address
  ![Add new address](postman-testing-screenshot/Add%20new%20address.png)
  
* Create new order with valid cart id and address id
  ![Create new order with valid cart id and address id](postman-testing-screenshot/Create%20a%20new%20order%20with%20valid%20cart%20id%20and%20address%20id.png)
  
* Create new order with invalid cart id
  ![Create new order with invalid cart id](postman-testing-screenshot/Create%20a%20new%20order%20with%20invalid%20cart%20id.png)
  
* Create new order with invalid address id
  ![Create new order with invalid address id](postman-testing-screenshot/Create%20a%20new%20order%20with%20invalid%20address%20id.png)
