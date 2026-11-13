
import mongoose, { Schema, Document } from "mongoose";

// Warehouse interface
export interface IWarehouse extends Document {
  name: string;
  location: string;
  capacity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Warehouse schema
const warehouseSchema = new Schema<IWarehouse>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create or reuse Warehouse model
const Warehouse =
  mongoose.models.Warehouse ||
  mongoose.model<IWarehouse>("Warehouse", warehouseSchema);

// Default export
export default Warehouse;
