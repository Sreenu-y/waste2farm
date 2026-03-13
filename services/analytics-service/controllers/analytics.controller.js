const Analytics = require('../models/Analytics');

// Carbon saved calculation: ~0.5 kg CO2 per kg of waste diverted from landfill
const CARBON_FACTOR = 0.5;
const WATER_FACTOR = 2.5; // liters per kg

/**
 * GET /api/analytics/dashboard — Get global or city dashboard stats
 */
const getDashboard = async (req, res, next) => {
  try {
    const { city, period = 'monthly', months = 6 } = req.query;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const match = { date: { $gte: startDate }, period };
    if (city) match.city = city;

    const results = await Analytics.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalWasteCollected: { $sum: '$metrics.totalWasteCollected' },
          totalWasteDiverted: { $sum: '$metrics.totalWasteDiverted' },
          carbonSaved: { $sum: '$metrics.carbonSaved' },
          waterSaved: { $sum: '$metrics.waterSaved' },
          farmersSupported: { $max: '$metrics.farmersSupported' },
          ordersCompleted: { $sum: '$metrics.ordersCompleted' },
          revenue: { $sum: '$metrics.revenue' },
        },
      },
    ]);

    const trend = await Analytics.find(match).sort('date').select('date metrics.ordersCompleted metrics.totalWasteCollected metrics.revenue city');

    res.json({
      success: true,
      data: {
        summary: results[0] || {},
        trend,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/cities — Get analytics breakdown by city
 */
const getCityBreakdown = async (req, res, next) => {
  try {
    const results = await Analytics.aggregate([
      { $match: { period: 'monthly' } },
      {
        $group: {
          _id: '$city',
          totalWaste: { $sum: '$metrics.totalWasteCollected' },
          carbonSaved: { $sum: '$metrics.carbonSaved' },
          revenue: { $sum: '$metrics.revenue' },
          orders: { $sum: '$metrics.ordersCompleted' },
          farmers: { $max: '$metrics.farmersSupported' },
        },
      },
      { $sort: { totalWaste: -1 } },
    ]);

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/waste-types — Get waste type distribution
 */
const getWasteTypeDistribution = async (req, res, next) => {
  try {
    const { city } = req.query;
    const match = { period: 'monthly' };
    if (city) match.city = city;

    const results = await Analytics.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          vegetable: { $sum: '$wasteByType.vegetable' },
          fruit: { $sum: '$wasteByType.fruit' },
          food: { $sum: '$wasteByType.food' },
          garden: { $sum: '$wasteByType.garden' },
          dairy: { $sum: '$wasteByType.dairy' },
          grain: { $sum: '$wasteByType.grain' },
          mixed: { $sum: '$wasteByType.mixed' },
          other: { $sum: '$wasteByType.other' },
        },
      },
    ]);

    res.json({ success: true, data: results[0] || {} });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/analytics/record — Record analytics data (internal use)
 */
const recordAnalytics = async (req, res, next) => {
  try {
    const { city, wasteCollected, wasteType, ordersCompleted, revenue } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const update = {
      $inc: {
        'metrics.totalWasteCollected': wasteCollected || 0,
        'metrics.totalWasteDiverted': wasteCollected || 0,
        'metrics.carbonSaved': (wasteCollected || 0) * CARBON_FACTOR,
        'metrics.waterSaved': (wasteCollected || 0) * WATER_FACTOR,
        'metrics.ordersCompleted': ordersCompleted || 0,
        'metrics.revenue': revenue || 0,
      },
    };

    if (wasteType) {
      update.$inc[`wasteByType.${wasteType}`] = wasteCollected || 0;
    }

    const record = await Analytics.findOneAndUpdate(
      { city, date: today, period: 'daily' },
      update,
      { upsert: true, new: true }
    );

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, getCityBreakdown, getWasteTypeDistribution, recordAnalytics };
