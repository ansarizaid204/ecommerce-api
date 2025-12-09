const express = require("express");
const router = express.Router();

const multer = require("multer");

const asyncHandler = require("express-async-handler");
const Model = require("../../models/product");

const moduleName = "Product";
const mediaPath = "product"; // without trailing slash
const CloudStorage = require("../../helpers/s3Storage");

const { sendResponse, sendError } = require("../../helpers/api");

const { createProductSchema } = require("../../validations/product.validation");
const { validateData } = require("../../helpers/joi");
const ProductCategory = require("../../models/productCategory");
const ALLOWED_TYPES = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const MAX_FILE_LIMIT = 5;

const MULTER_ERROR_MESSAGES = {
  LIMIT_FILE_SIZE: "File too large. Maximum limit is 1MB.",
  LIMIT_UNEXPECTED_FILE: `Too many files uploaded. Max is ${MAX_FILE_LIMIT}.`,
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,

  limits: {
    fileSize: 1 * 1024 * 1024, // 1 MB
  },

  fileFilter: (req, file, cb) => {
    const isValidType = !!ALLOWED_TYPES[file.mimetype];

    if (isValidType) {
      cb(null, true);
    } else {
      const error = new Error(
        "Invalid file type. Only JPG, PNG, WEBP, and AVIF are allowed."
      );
      error.code = "INVALID_FILE_TYPE";
      cb(error, false);
    }
  },
});

const uploadMultiple = upload.fields([
  { name: "images", maxCount: MAX_FILE_LIMIT },
]);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    uploadMultiple(req, res, async (err) => {
      if (err) {
        const message = MULTER_ERROR_MESSAGES[err.code] || err.message;

        return res.status(400).send(sendError(message, 400));
      } else {
        try {
          // Validation
          

          const { error } = validateData(createProductSchema, req.body);

          if (error) {
            return res.status(400).send(sendError(error.details[0].message, 400));
          }

          const { title, description, price, category } = req.body;

          const images = req.files.images;

          if (!images || images.length === 0) {
            return res.status(400).send(sendError("Minimum 1 image is required", 400));
          }


         const categoryData = await ProductCategory.findById(category);

          if(!categoryData){
            return res.status(400).send(sendError("Invalid Category", 400));

          }


          const uploadPromises = images.map((file) =>
            CloudStorage.uploadFile(file, mediaPath)
          );

          const uploadedImages = await Promise.all(uploadPromises);

          const dataToCreate = {
            title,
            description,
            price,
            category,
            images: uploadedImages.map((img, i) => ({
              name: img,
              order: i,
            })),
          };

          const data = await Model.create(dataToCreate);

          res.send(sendResponse({}, `${moduleName} Created Successfullly`));
        } catch (error) {
          res.status(500).send(sendError("Internal Server Error", 500));
        }
      }
    });
  })
);

module.exports = router;
