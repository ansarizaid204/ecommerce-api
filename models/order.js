const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderNumber: String,

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        productTitle: String,
        quantity: Number,
        price: Number,
        subTotal: Number,
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      enum: ["pending", "dispatched", "out_for_delivery", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", Schema);
