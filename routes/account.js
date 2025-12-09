const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { sendResponse } = require("../helpers/api");
const Order = require("../models/order");
const User = require("../models/user");

router.get(
  "/profile",

  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const data = await User.findById(userId).select("name email");

    res.send(sendResponse(data));
  })
);
router.get(
  "/orders",

  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const orders = await Order.find({ userId });

    res.send(sendResponse(orders));
  })
);

module.exports = router;
