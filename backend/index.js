require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Stripe = require("stripe");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(fileUpload({ useTempFiles: true }));
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

// schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});
const userModel = mongoose.model("user", userSchema);

app.get("/allUsers", async (req, res) => {
  try {
    const users = await userModel.find();
    res.send({ users, nbHits: users.length });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send({ message: "Email is required!" });
    }
    const user = await userModel.findOne({ email });
    if (user) {
      return res.send({ message: "user already exist", alert: false });
    }
    const newUser = await userModel.create(req.body);
    res.send({ message: "registeration successfull", alert: true });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.send({ message: "All fields are required!" });
    }
    const user = await userModel.findOne({ email });
    if (!user)
      return res.send({ message: "User does not exist", alert: false });
    const dataSend = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
    };
    res.send({ message: "Login successfull", alert: true, data: dataSend });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// product section

const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});

const productModel = mongoose.model("product", schemaProduct);

app.post("/uploadProduct", async (req, res) => {
  try {
    const product = await productModel.create(req.body);
    res.send({ message: "uploaded successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
// app.use(express.static("./public"));
app.post("/uploadProductLocal/image", async (req, res) => {
  try {
    // console.log(req.files);
    let productImage = req.files.image;
    const imagePath = path.join(
      __dirname,
      "../frontend/public/uploads/" + `${productImage.name}`
    );

    await productImage.mv(imagePath);

    return res.send({ image: { src: `/uploads/${productImage.name}` } });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/uploadProduct/image", async (req, res) => {
  try {
    // console.log(req.files.image);
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: "etables",
      }
    );
    fs.unlinkSync(req.files.image.tempFilePath);
    // console.log(result);
    res.send({ image: { src: result.secure_url } });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await productModel.find();
    res.send({ products });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// handle payment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.post("/create-checkout-session", async (req, res) => {
  try {
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [{ shipping_rate: "shr_1OKhGmSE5m5XQ8Qf0RLN4IFa" }],

      line_items: req.body.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
              // images : [item.image]
            },
            unit_amount: item.price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.qty,
        };
      }),

      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params);
    // console.log(session)
    res.status(200).json(session.id);
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is running at port ${PORT}...`));
