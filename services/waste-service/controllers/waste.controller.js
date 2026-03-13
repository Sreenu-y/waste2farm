const WasteListing = require("../models/WasteListing");
const User = require("../models/User"); // Register User model for population

/**
 * POST /api/waste — Create a new waste listing
 */
const createListing = async (req, res, next) => {
  try {
    console.log("📝 Creating listing for user:", req.user.id);
    console.log("📦 Body:", req.body);
    const listing = await WasteListing.create({
      ...req.body,
      generatorId: req.user.id,
    });
    console.log("✅ Listing created:", listing._id);
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error("❌ Listing creation failed:", error);
    next(error);
  }
};

/**
 * GET /api/waste — Get all listings with filters
 */
const getListings = async (req, res, next) => {
  try {
    const {
      type,
      city,
      status = "available",
      page = 1,
      limit = 20,
      sort = "-createdAt",
    } = req.query;

    const filter = { status };
    if (type) filter.type = type;
    if (city) filter.city = { $regex: city, $options: "i" };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [listings, total] = await Promise.all([
      WasteListing.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("generatorId", "name phone city rating"),
      WasteListing.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/waste/nearby — Geo-query nearby listings
 */
const getNearby = async (req, res, next) => {
  try {
    const { lng, lat, radius = 10, type } = req.query;

    if (!lng || !lat) {
      return res
        .status(400)
        .json({ success: false, error: "lng and lat are required." });
    }

    const filter = {
      status: "available",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radius) * 1000, // km to meters
        },
      },
    };
    if (type) filter.type = type;

    const listings = await WasteListing.find(filter)
      .limit(50)
      .populate("generatorId", "name phone city rating");

    res.json({ success: true, data: listings });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/waste/:id — Get single listing
 */
const getListing = async (req, res, next) => {
  try {
    const listing = await WasteListing.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate("generatorId", "name phone city rating");

    if (!listing) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found." });
    }
    res.json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/waste/:id — Update listing (owner only)
 */
const updateListing = async (req, res, next) => {
  try {
    const listing = await WasteListing.findOneAndUpdate(
      { _id: req.params.id, generatorId: req.user.id },
      req.body,
      { new: true, runValidators: true },
    );
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found or unauthorized." });
    }
    res.json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/waste/my — Get listings for the current user
 */
const getMyListings = async (req, res, next) => {
  try {
    const listings = await WasteListing.find({ generatorId: req.user.id })
      .sort("-createdAt")
      .populate("generatorId", "name phone city rating");
    res.json({ success: true, data: listings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createListing,
  getListings,
  getNearby,
  getListing,
  updateListing,
  getMyListings,
};
