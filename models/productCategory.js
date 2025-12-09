const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    title: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductCategory", Schema);
