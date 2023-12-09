require("dotenv").config();
// const express = require("express");
const items = require("./items.json");
const mongoose = require("mongoose");

// const app = express();

// app.use(express.json({ limit: "10mb" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});

const productModel = mongoose.model("product", schemaProduct);

const start = async () => {
  try {
    await productModel.deleteMany();
    const product = await productModel.create(items);
    console.log("db connected");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
