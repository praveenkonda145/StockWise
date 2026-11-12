
import { Router } from "express";

import {
  stockIn,
  stockOut,
  getStockMovements
} from "../controllers/inventory.controller";

const router = Router();

router.post("/:id/stock-in", stockIn);
router.post("/:id/stock-out", stockOut);
router.get("/:id/movements", getStockMovements);

export default router;
