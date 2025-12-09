const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const Model = require("../../models/productCategory");

const moduleName = "Category";

const { sendResponse, sendError } = require("../../helpers/api");
const { validateData } = require("../../helpers/joi");
const {
  createCategorySchema,
} = require("../../validations/category.validation");

router.get(
  "/",

  asyncHandler(async (req, res) => {
    const data = await Model.find();

    res.send(sendResponse(data));
  })
);
router.post(
  "/",

  asyncHandler(async (req, res) => {
    const { error } = validateData(createCategorySchema, req.body);

    if (error) {
      return res.status(400).send(sendError(error.details[0].message, 400));
    }

    const data = await Model.create(req.body);

    res.send(sendResponse(data, `${moduleName} Created Successfullly`));
  })
);

module.exports = router;
