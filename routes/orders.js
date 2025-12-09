const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

const { sendResponse, sendError } = require("../helpers/api");

const Product = require("../models/product");
const moment = require("moment");
const Order = require("../models/order");
const { v4: uuidv4 } = require("uuid");
const agenda = require("../jobs/agenda");

const { createOrderSchema } = require("../validations/order.validation");
const { validateData } = require("../helpers/joi");

const generateOrderNumber = () => {
  const date = moment().format("YYYYMMDD");
  const randomString = uuidv4().split("-")[0].toUpperCase();
  return `ORD-${date}-${randomString}`;
};

router.post(
  "/checkout",

  asyncHandler(async (req, res) => {
    const { items } = req.body;

    const userId = req.user._id;

    let totalAmount = 0;
    const orderItems = [];

    // Validation

    const { error } = validateData(createOrderSchema, req.body);

    if (error) {
      return res.status(400).send(sendError(error.details[0].message, 400));
    }

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.send(
          sendError(`Product with ID ${item.productId} not found`, 400)
        );
      }

      const subTotal = product.price * item.quantity;
      totalAmount += subTotal;

      orderItems.push({
        productId: product._id,
        productTitle: product.title,
        quantity: item.quantity,
        price: product.price,
        subTotal: subTotal,
      });
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: userId,
      items: orderItems,
      totalAmount: totalAmount,
      status: "pending",
    });

    //sending email
    agenda.now("order-email", order);

    res.send(sendResponse(order, "Order Placed!"));
  })
);

module.exports = router;
