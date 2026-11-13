
import connectDB from "./config/db";
import "dotenv/config";
import express from "express";
import cors from "cors";

import productRoutes from "./routes/product.routes";
import inventoryRoutes from "./routes/inventory.routes";
import authRoutes from "./routes/auth.routes";
import warehouseRoutes from "./routes/warehouse.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "StockWise backend is running!"
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`StockWise server running on port ${PORT}`);
  });
};

startServer();
