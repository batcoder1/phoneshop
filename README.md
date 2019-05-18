
[![Build Status](https://travis-ci.org/wooltar/phoneshop.svg?branch=master)](https://travis-ci.org/wooltar/phoneshop)
![npm](https://img.shields.io/badge/npm-v6.7.0-blue.svg)


# PhoneShop Microservices

Nodejs application with microservices ARQ. Using Redis to allow the comunication between microservices. 
When a customer make a order, the stock is updated and the customer balance is updated too, substract phone price from customer balance. If customer hasn't enought money, return a error


## start backend
```
$ docker-compose up
```

## Run all tests
```
$ yarn test
```

## Phones

Microservice to manage phones

### Get all phones - pagination
```
GET/ http://localhost:5555/phones?page=1
```

### Create a new phone
```
POST/ http://localhost:5555/phones/create
```

## Orders

Microservice to manage orders

### Get all orders
```
GET/ http://localhost:7777/orders
```
 
### Create a new order
To create order with autocheck
```
POST/ http://localhost:7777/orders/create
```

### Check
Check the orden and change it to completed status
```
POST/ http://localhost:7777/phones/check/:id
```

# QUESTIONS

## How would you improve the system?

### Adding websockets
Adding websockets to handler event between microservices

### Adding stock phone control
When a customer makes a purchase, Order microservice sends a event stating that the sale has been made. Phone mircroservice will listen for this event and it will update phones stock.

### Creating email verification of purchase
when a customer makes a purchase, and it's completed, the system sends a confirmation email with purchase detail


## How would you avoid your order API to be overflow?
We could solve this using child process (https://nodejs.org/api/child_process.html) or cluster (https://nodejs.org/api/cluster.html) in order to use more CPU cores.

Also, we could use nginx to manager some application instances running in diferent ports.
And if we've deployed in aws,  we could use some ec2 amazon instance with ELB to manage the request and send it to available ec2 instance. 