## How to Run & Test the Product API

==============================================================

# 1. Setup & Run the Server (bash commands)

==============================================================
Open your terminal (bash shell) and follow these steps:

# Step 1: Clone or create your project folder

git clone url

# Step 2: Initialize npm and install dependencies

npm init -y
npm install express uuid dotenv

# Step 3: Create a .env file with your API key and port

echo or touch "API_KEY=my-secret-api-key" > .env
echo or touch "PORT=3000" >> .env

# Step 4: Create a server.js file with your Express app code

Copy your Express app code (with routes, middleware, etc.) into server.js.
You can use VSCode:
node server.js

Then paste the code and save.

# Step 5: Start the server

    node server.js
    You should see:
    Server running at http://localhost:3000

## 2. Testing the API with Postman

==============================================================

# Step 1: Open Postman app

# Step 2: Add the API key to your request headers

# For every request, add a header:

Key Value
x-api-key my-secret-api-key

# Step 3: Test endpoints

# Get all products (GET)

URL: http://localhost:3000/api/products
Method: GET
Headers: include x-api-key

# Get product by ID (GET)

URL: http://localhost:3000/api/products/1
Method: GET
Headers: include x-api-key

# Create new product (POST)

URL: http://localhost:3000/api/products
Method: POST
Headers: include x-api-key
Body: Select raw and JSON format. Example:
{
"name": "Tablet",
"description": "10-inch display tablet",
"price": 300,
"category": "electronics",
"inStock": true
}

# Update product (PUT)

URL: http://localhost:3000/api/products/1
Method: PUT
Headers: include x-api-key
Body (raw JSON) example:
{
"name": "Laptop Pro",
"description": "High-performance laptop with 32GB RAM",
"price": 1800,
"category": "electronics",
"inStock": true
}

# Delete product (DELETE)

URL: http://localhost:3000/api/products/1
Method: DELETE
Headers: include x-api-key
Search products by name (GET)
URL example: http://localhost:3000/api/products/search?name=phone

# Method: GET

Headers: include x-api-key

# Get product statistics (GET)

URL: http://localhost:3000/api/products/stats
Method: GET
Headers: include x-api-key
