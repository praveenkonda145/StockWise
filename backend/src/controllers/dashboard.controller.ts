
import { Request, Response } from "express";

import Product from "../models/Product";
import Warehouse from "../models/Warehouse";
import StockMovement from "../models/StockMovement";

// GET dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalProducts,
      totalWarehouses,
      stockResult,
      lowStockProducts,
      outOfStockProducts,
      recentMovements
    ] = await Promise.all([
      Product.countDocuments(),

      Warehouse.countDocuments(),

      Product.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$quantity" }
          }
        }
      ]),

      Product.countDocuments({
        quantity: { $gt: 0 },
        $expr: {
          $lte: ["$quantity", "$minimumStockLevel"]
        }
      }),

      Product.countDocuments({
        quantity: { $lte: 0 }
      }),

      StockMovement.find()
        .populate("product", "name sku")
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const totalStockQuantity = stockResult[0]?.total ?? 0;

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        totalProducts,
        totalWarehouses,
        totalStockQuantity,
        lowStockProducts,
        outOfStockProducts,
        recentMovements
      }
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    });
  }
};
