const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("./verifyToken");
const express = require("express");
const router = express.Router();

// CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const saveProduct = await newProduct.save();
    res.status(200).json(saveProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
