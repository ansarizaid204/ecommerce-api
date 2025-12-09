const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    title: String,

    description: String,

    images: [
      {
        name: String,
        order: Number,
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
    },

    price: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", Schema);
