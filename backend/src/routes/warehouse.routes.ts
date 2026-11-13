
import { Router } from "express";

import {
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse
} from "../controllers/warehouse.controller";

const router = Router();

// Create a warehouse
router.post("/", createWarehouse);

// Get all warehouses
router.get("/", getAllWarehouses);

// Get one warehouse
router.get("/:id", getWarehouseById);

// Update a warehouse
router.put("/:id", updateWarehouse);

// Delete a warehouse
router.delete("/:id", deleteWarehouse);

export default router;
