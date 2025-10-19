// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require("express");
const { endianness } = require("os");
// const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
// const connectDB = require("./config/db");
// const Product = require("./models/products");
require("dotenv").config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
// API key
const API_KEY = process.env.API_KEY;

// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];
// - Request logging
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

app.use(logger);

//- Create an authentication middleware that checks for an API key in the request headers
const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey) {
    return res.status(401).json({ error: "Missing API KEY." });
  }
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: "Invalid API KEY." });
  }
  next();
};

app.use(authenticate);

// Root route
app.get("/", async (req, res) => {
  res.send(
    "Welcome to the Product API! Go to /api/products to see all products."
  );
});
// Validation middleware for product data
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  const errors = [];

  if (!name || typeof name !== "string") {
    errors.push("Name is required and must be a string.");
  }

  if (!description || typeof description !== "string") {
    errors.push("Description is required and must be a string.");
  }

  if (price == null || typeof price !== "number" || price < 0) {
    errors.push("Price is required and must be a non-negative number.");
  }

  if (!category || typeof category !== "string") {
    errors.push("Category is required and must be a string.");
  }

  if (typeof inStock !== "boolean") {
    errors.push("InStock must be a boolean value.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next(); // All validations passed
};

// GET /api/products - Get all products
app.get("/api/products", async (req, res) => {
  res.json(products);
});

// GET /api/products/:id - Get a specific product
app.get("/api/products/:id", async (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status.apply(404).json({ error: "Product not found" });
  }
  res.json(product);
});

// POST /api/products - Create a new product
app.post("/api/products", validateProduct, async (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  try {
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "failed to create product." });
  }
});

// PUT /api/products/:id - Update a product
app.put("/api/products/:id", validateProduct, (req, res) => {
  const index = products.findIndex((p) => p.id === this.req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found." });
  }

  const updateProduct = { ...products[index], ...res.body };
  products[index] = updateProduct;
  res.json(updateProduct);
});

// DELETE /api/products/:id - Delete a product
app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found." });
  }

  const deleteProduct = products.splice(index, 1);
  res.json({ message: "Product deleted", deleted: delete [0] });
});

//- Implement query parameters for filtering products by category
app.get("/api/products", (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    return res.json(filtered);
  }
});

//- Pagination support for the product listing endpoint
app.get("/api/products", (req, res) => {
  //convert to numbers
  const pagaNum = parseInt(req.query.page) || 1;
  const limitNum = parseInt(req.query.limit) || 10;

  //validate page and limit
  if (page < 1 || limit < 1) {
    return res
      .status(400)
      .json({ error: "Page and limit must be positive numbers." });
  }

  const startNum = (page - 1) * limit;
  const endNum = startNum + limit;

  const paginateProducts = products.slice(startNum, endNum);

  res.json({
    page,
    limit,
    total: products.length,
    totalPages: Math.ceil(products.length / limit),
    data: paginateProducts,
  });
});

//- A search endpoint that allows searching products by name
app.get("/api/products/search", (req, res) => {
  const { name } = req.query;

  //case insensitive search by name
  const results = products.filter((prd) =>
    prd.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json({ query: name, resultsCount: results.length });
});

//- Implement route for getting product statistics (e.g., count by category)
app.get("/api/products/stats", (req, res) => {
  const total = products.length;

  // Count by category
  const countByCategory = {};
  for (const product of products) {
    const category = product.category.toLowerCase();
    countByCategory[category] = (countByCategory[category] || 0) + 1;
  }

  // In-stock vs out-of-stock
  let inStock = 0;
  let outOfStock = 0;
  for (const product of products) {
    if (product.inStock) inStock++;
    else outOfStock++;
  }

  res.json({
    totalProducts: total,
    countByCategory,
    stockStatus: {
      inStock,
      outOfStock,
    },
  });
});

//custom middleware for:
// - Error handling
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
