const Chemicals = require("../models/chemicals.models");
const Reagents = require("../models/reagents.models");
const Glassware = require("../models/glassware.models");
const Measuring = require("../models/measuring.models");
const Others = require("../models/others.models");

// Helper function to calculate total count and total quantity of all items
const getTotalCountAndQuantity = async (model) => {
    const totalCount = await model.countDocuments();
    const totalQuantity = await model.aggregate([
        { $group: { _id: null, total: { $sum: "$current_quantity" } } }
    ]);
    return {
        totalCount,
        totalQuantity: totalQuantity[0] ? totalQuantity[0].total : 0
    };
};

// Helper function to calculate total stock count and quantity
const getStockSummary = async (model) => {
    const lowStock = await model.countDocuments({ $expr: { $lte: ["$current_quantity", "$min_stock_level"] } });
    const zeroStock = await model.countDocuments({ current_quantity: 0 });

    return {
        lowStock,
        zeroStock,

    };
};

// Helper function to get in stock products count
const getInStockSummary = async (model) => {
    const inStockCount = await model.countDocuments({ $expr: { $gt: ["$current_quantity", "$min_stock_level"] } });
    return inStockCount;
};


// Helper function to get near expiry and expired counts
const getExpirySummary = async (model) => {
    const nearExpiryCount = await model.countDocuments({ expiration_alert_date: { $lte: new Date() } });
    const expiredCount = await model.countDocuments({ expiration_date: { $lt: new Date() } });
    return {
        nearExpiryCount,
        expiredCount
    };
};

// Helper function to get detailed items
const getItemsDetail = async (model, filter) => {
    return model.find(filter).exec();
};

exports.getDashboardSummary = async (req, res) => {
    try {
        // Calculate summaries for all models
        const chemicalsSummary = await getTotalCountAndQuantity(Chemicals);
        const reagentsSummary = await getTotalCountAndQuantity(Reagents);
        const glasswareSummary = await getTotalCountAndQuantity(Glassware);
        const measuringSummary = await getTotalCountAndQuantity(Measuring);
        const othersSummary = await getTotalCountAndQuantity(Others);

        // Calculate stock summaries
        const chemicalsStock = await getStockSummary(Chemicals);
        const reagentsStock = await getStockSummary(Reagents);
        const glasswareStock = await getStockSummary(Glassware);
        const measuringStock = await getStockSummary(Measuring);
        const othersStock = await getStockSummary(Others);

        // Calculate expiry summaries
        const chemicalsExpiry = await getExpirySummary(Chemicals);
        const reagentsExpiry = await getExpirySummary(Reagents);
        const othersExpiry = await getExpirySummary(Others);

        // Calculate in stock summaries
        const chemicalsInStock = await getInStockSummary(Chemicals);
        const reagentsInStock = await getInStockSummary(Reagents);
        const glasswareInStock = await getInStockSummary(Glassware);
        const measuringInStock = await getInStockSummary(Measuring);
        const othersInStock = await getInStockSummary(Others);

        // Total in stock count
        const inStockCount = chemicalsInStock + reagentsInStock + glasswareInStock + measuringInStock + othersInStock;

        // Total low stock count
        const lowStockCount = chemicalsStock.lowStock + reagentsStock.lowStock + glasswareStock.lowStock + measuringStock.lowStock + othersStock.lowStock;

        // Total near expiry count
        const nearExpiryCount = chemicalsExpiry.nearExpiryCount + reagentsExpiry.nearExpiryCount + othersExpiry.nearExpiryCount;

        // Total zero stock count
        const zeroStockCount = chemicalsStock.zeroStock + reagentsStock.zeroStock + glasswareStock.zeroStock + measuringStock.zeroStock + othersStock.zeroStock;

        // Total expired items count
        const expiredItemsCount = chemicalsExpiry.expiredCount + reagentsExpiry.expiredCount + othersExpiry.expiredCount;

        // Fetch detailed low stock items
        const lowStockItems = [
            ...(await getItemsDetail(Chemicals, { $expr: { $lte: ["$current_quantity", "$min_stock_level"] } })),
            ...(await getItemsDetail(Reagents, { $expr: { $lte: ["$current_quantity", "$min_stock_level"] } })),
            ...(await getItemsDetail(Glassware, { $expr: { $lte: ["$current_quantity", "$min_stock_level"] } })),
            ...(await getItemsDetail(Measuring, { $expr: { $lte: ["$current_quantity", "$min_stock_level"] } })),
            ...(await getItemsDetail(Others, { $expr: { $lte: ["$current_quantity", "$min_stock_level"] } }))
        ];

        // Fetch detailed near expiry items
        const nearExpiryItems = [
            ...(await getItemsDetail(Chemicals, { expiration_alert_date: { $lte: new Date() } })),
            ...(await getItemsDetail(Reagents, { expiration_alert_date: { $lte: new Date() } })),
            ...(await getItemsDetail(Others, { expiration_alert_date: { $lte: new Date() } }))
        ];

        // Calculate total items and total quantity across all models
        const totalItemsCount = chemicalsSummary.totalCount + reagentsSummary.totalCount + glasswareSummary.totalCount + measuringSummary.totalCount + othersSummary.totalCount;
        const totalItemsQuantity = chemicalsSummary.totalQuantity + reagentsSummary.totalQuantity + glasswareSummary.totalQuantity + measuringSummary.totalQuantity + othersSummary.totalQuantity;



        // Send the dashboard summary
        res.status(200).json({
            chemicalsSummary,
            reagentsSummary,
            glasswareSummary,
            measuringSummary,
            othersSummary,
            totalItemsCount,
            totalItemsQuantity,
            lowStockCount,
            nearExpiryCount,
            zeroStockCount,
            inStockCount,
            expiredItemsCount,
            outOfStockItemsCount: zeroStockCount,
            lowStockItems, // Send detailed low stock items
            nearExpiryItems,// Send detailed near expiry items
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard data", error });
    }
};