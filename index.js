const express = require("express");
const cors = require("cors");
const path = require("path");

const logger = require("./logger");
const Agendash = require("agendash");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const db = require("./helpers/db");
const smtp = require("./helpers/smtp");
const errorHandler = require("./middlewares/errorHandler");
const agenda = require("./jobs/agenda");
const config = require("./config/config");

const app = express();

// ===============================CONSTANTS============================================
const PORT = config.app_port || 4000;

// ===============================MIDDLEWARES============================================
const auth = require("./middlewares/auth");

app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// ===============================SMTP============================================
// smtp.verify(function (error, success) {
//   if (error) {
//     logger.error(error.message);
//   } else {
//     logger.info("SMTP Connected");
//   }
// });

// ===============================DATABASE============================================

db.on("open", () => logger.info("Database connected"));

// ===============================AGENDA============================================

app.use("/agenda-dash", Agendash(agenda));

// =============================AUTH ROUTES======================================
app.use("/auth", require("./routes/auth"));

// =============================FRONTEND ROUTES======================================

app.use("/products", auth, require("./routes/products"));

app.use("/orders", auth, require("./routes/orders"));
app.use("/account", auth, require("./routes/account"));

// =============================ADMIN ROUTES======================================

app.use(
  "/admin/products/categories",
  auth,
  require("./routes/admin/productCategories")
);
app.use("/admin/products", auth, require("./routes/admin/products"));

// ===============================ERROR HANDLING============================================
app.use(errorHandler);

// ===============================SERVER============================================
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
