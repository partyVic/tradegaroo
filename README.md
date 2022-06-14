## Tradegaroo - an online eCommerce trading platform

> Built with the MERN stack & Redux

------------

### Backend RESTful APIs
```
-------------------------------------------------------------------------
Product routes :
-------------------------------------------------------------------------
[Method]  [Route]
GET       /api/products                                           Get all products
GET       /api/products/:id                                       Get a single product by id
GET       /api/products/top                                       Get top 3 most popular products
PUT       /api/products/:id                                       Update a product. Admin only
POST      /api/products                                           Add a new product. Admin only
POST      /api/products/:id/reviews                               Add a new product review
DELETE    /api/products/:id                                       Delete a product. Admin only
-------------------------------------------------------------------------
User & Auth routes :
-------------------------------------------------------------------------
[Method]  [Route]
GET       /api/usersGet all users.                                Admin only
GET       /api/users/:id                                          Get user by ID. admin only
GET       /api/users/profile                                      Return logged in user
PUT       /api/users/profile                                      Update user profile
PUT       /api/users/:id                                          Update a user by ID. admin only
POST      /api/users                                              Create a new user
POST      /api/users/login                                        Authenticate user and get token
DELETE    /api/users/:id                                          Delete a user. Admin only
-------------------------------------------------------------------------
Order routes :
-------------------------------------------------------------------------
[Method]  [Route]
GET       /api/orders                                             Get all user orders. Admin only
GET       /api/orders/:id                                         Get an order by id
GET       /api/orders/myorders                                    Get logged in users orders
PUT       /api/orders/:id/deliver                                 Update an order to delivered. Admin only
-------------------------------------------------------------------------
Upload route :
-------------------------------------------------------------------------
[Method]  [Route]
POST      /api/upload                                             Upload images to Cloudinary
```


------------
### Frontend Features

###### 1. Home Screen
![](https://res.cloudinary.com/dsk0gjgdw/image/upload/v1655205270/Tradegaroo/home_awjd5z.png)


###### 2. Products Management
![](https://res.cloudinary.com/dsk0gjgdw/image/upload/v1655205270/Tradegaroo/products_yvdh3f.png)


###### 3. User Edit
![](https://res.cloudinary.com/dsk0gjgdw/image/upload/v1655205686/Tradegaroo/users_nowmuo.png)


###### 4. Order Tracking
![](https://res.cloudinary.com/dsk0gjgdw/image/upload/v1655205270/Tradegaroo/orders_n03apx.png)

###### 5. Paypal Payment
![](https://res.cloudinary.com/dsk0gjgdw/image/upload/v1655205270/Tradegaroo/Paypal_hrggo6.png)
