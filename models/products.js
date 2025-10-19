const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const productSchema = new mongoose.Schema(
  {
    //       - `id` (unique identifier)
    //   - `name` (string)
    //   - `description` (string)
    //   - `price` (number)
    //   - `category` (string)
    //   - `inStock` (boolean)
    id: { type: String, unique: true, default: uuidv4 },
    name: { type: String, required: true },
    describe: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
