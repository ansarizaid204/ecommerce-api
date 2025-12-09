const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

const { sendResponse, sendError } = require("../helpers/api");
const Model = require("../models/product");

const config = require("../config/config");

const mediaUrl = `${config.aws.s3BaseUrl}/product`;

router.get(
  "/",

  asyncHandler(async (req, res) => {
    const products = await Model.find().populate("category").lean();

    const transformedData = products.map((product) => {
      const cleanImages = product.images
        .map((img) => ({
          order: img.order,
          url: `${mediaUrl}/${img.name}`,
        }))
        .sort((a, b) => a.order - b.order);

      return {
        ...product,
        images: cleanImages,
      };
    });

    res.send(sendResponse(transformedData, "", 200));
  })
);

router.get(
  "/:id",

  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const product = await Model.findById(id).populate("category").lean();

    if (!product) {
      res.status(404).send(sendError("Not Found", 404));
    }

    const cleanImages = product.images
      .map((img) => ({
        order: img.order,
        url: `${mediaUrl}/${img.name}`,
      }))
      .sort((a, b) => a.order - b.order);

    product.images = cleanImages;

    res.send(sendResponse(product, "", 200));
  })
);

module.exports = router;
