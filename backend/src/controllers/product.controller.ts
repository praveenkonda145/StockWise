
import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";

// CREATE PRODUCT
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      sku,
      description,
      category,
      price,
      quantity,
      minimumStockLevel,
      warehouse
    } = req.body;

    if (!name || !sku || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, SKU, category and price are required."
      });
    }

    const product = await Product.create({
      name,
      sku,
      description,
      category,
      price,
      quantity,
      minimumStockLevel,
      warehouse
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A product with this SKU already exists."
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create product"
    });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products"
    });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req: Request, res: Response) => {
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

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product"
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    // Only allow fields defined in the Product model.
    const allowedFields = [
      "name",
      "sku",
      "description",
      "category",
      "price",
      "quantity",
      "minimumStockLevel",
      "warehouse"
    ];

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid field to update."
      });
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A product with this SKU already exists."
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update product"
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product"
    });
  }
};
