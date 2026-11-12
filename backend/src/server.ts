import connectDB from "./config/db";
import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Test route
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