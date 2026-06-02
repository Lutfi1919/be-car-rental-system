const express = require("express");
const router = express.Router();

const checkoutController = require("../controllers/checkout.controller");
const upload = require("../middlewares/upload");

router.post("/", upload.none(), checkoutController.checkout);

module.exports = router;