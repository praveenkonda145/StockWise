
import { Request, Response } from "express";
import mongoose from "mongoose";
import Warehouse from "../models/Warehouse";

// CREATE warehouse
export const createWarehouse = async (req: Request, res: Response) => {
  try {
    const { name, location, capacity } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof location !== "string" ||
      !location.trim() ||
      capacity === undefined ||
      capacity === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, location and capacity are required"
      });
    }

    if (
      typeof capacity !== "number" ||
      !Number.isFinite(capacity) ||
      capacity < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be a valid number greater than or equal to 0"
      });
    }

    const warehouse = await Warehouse.create({
      name: name.trim(),
      location: location.trim(),
      capacity
    });

    return res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      data: warehouse
    });
  } catch (error) {
    console.error("Create warehouse error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create warehouse"
    });
  }
};

// GET all warehouses
export const getAllWarehouses = async (req: Request, res: Response) => {
  try {
    const warehouses = await Warehouse.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: warehouses.length,
      data: warehouses
    });
  } catch (error) {
    console.error("Get warehouses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch warehouses"
    });
  }
};

// GET warehouse by ID
export const getWarehouseById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid warehouse ID"
      });
    }

    const warehouse = await Warehouse.findById(id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: warehouse
    });
  } catch (error) {
    console.error("Get warehouse error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch warehouse"
    });
  }
};

// UPDATE warehouse
export const updateWarehouse = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid warehouse ID"
      });
    }

    const { name, location, capacity } = req.body;

    const updates: {
      name?: string;
      location?: string;
      capacity?: number;
    } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name must be a non-empty string"
        });
      }

      updates.name = name.trim();
    }

    if (location !== undefined) {
      if (typeof location !== "string" || !location.trim()) {
        return res.status(400).json({
          success: false,
          message: "Location must be a non-empty string"
        });
      }

      updates.location = location.trim();
    }

    if (capacity !== undefined) {
      if (
        typeof capacity !== "number" ||
        !Number.isFinite(capacity) ||
        capacity < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Capacity must be a valid number greater than or equal to 0"
        });
      }

      updates.capacity = capacity;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update"
      });
    }

    const warehouse = await Warehouse.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Warehouse updated successfully",
      data: warehouse
    });
  } catch (error) {
    console.error("Update warehouse error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update warehouse"
    });
  }
};

// DELETE warehouse
export const deleteWarehouse = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid warehouse ID"
      });
    }

    const warehouse = await Warehouse.findByIdAndDelete(id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Warehouse deleted successfully"
    });
  } catch (error) {
    console.error("Delete warehouse error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete warehouse"
    });
  }
};
