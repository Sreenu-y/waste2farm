const express = require("express");
const {
  createListing,
  getListings,
  getNearby,
  getListing,
  updateListing,
  getMyListings,
} = require("../controllers/waste.controller");
const { authenticate, authorize } = require("../../shared/auth");
const { validate, wasteListingSchema } = require("../../shared/validators");

const router = express.Router();

router.get("/my", authenticate, getMyListings);
router.get("/nearby", authenticate, getNearby);
router.get("/", authenticate, getListings);
router.get("/:id", authenticate, getListing);
router.post(
  "/",
  authenticate,
  authorize("generator", "admin"),
  validate(wasteListingSchema),
  createListing,
);
router.put(
  "/:id",
  authenticate,
  authorize("generator", "admin"),
  updateListing,
);

module.exports = router;
