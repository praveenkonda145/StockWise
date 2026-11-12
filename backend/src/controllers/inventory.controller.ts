
import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";
import StockMovement from "../models/StockMovement";

// STOCK IN
export const stockIn = async (req: Request, res: Response) => {
  return handleStockMovement(req, res, "IN");
};

// STOCK OUT
export const stockOut = async (req: Request, res: Response) => {
  return handleStockMovement(req, res, "OUT");
};

// COMMON STOCK MOVEMENT FUNCTION
const handleStockMovement = async (
  req: Request,
  res: Response,
  type: "IN" | "OUT"
) => {
  const { id } = req.params;
  const { quantity, note } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID"
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be a positive whole number"
    });
  }

  const session = await mongoose.startSession();

  try {
    let movement: any;

    await session.withTransaction(async () => {
      const product = await Product.findById(id).session(session);

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const previousQuantity = product.quantity;

      if (type === "OUT" && quantity > previousQuantity) {
        throw new Error("INSUFFICIENT_STOCK");
      }

      const newQuantity =
        type === "IN"
          ? previousQuantity + quantity
          : previousQuantity - quantity;

      product.quantity = newQuantity;
      await product.save({ session });

      const movements = await StockMovement.create(
        [
          {
            product: product._id,
            type,
            quantity,
            previousQuantity,
            newQuantity,
            note
          }
        ],
        { session }
      );

      movement = movements[0];
    });

    return res.status(200).json({
      success: true,
      message: type === "IN"
        ? "Stock added successfully"
        : "Stock removed successfully",
      data: movement
    });
  } catch (error: any) {
    if (error.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (error.message === "INSUFFICIENT_STOCK") {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available"
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Stock movement failed"
    });
  } finally {
    await session.endSession();
  }
};

// GET PRODUCT STOCK MOVEMENT HISTORY
export const getStockMovements = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const movements = await StockMovement.find({
      product: id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: movements.length,
      data: movements
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch stock movements"
    });
  }
};
