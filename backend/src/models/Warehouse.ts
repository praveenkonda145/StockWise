
import mongoose, { Schema } from "mongoose";

interface IWarehouse {
  name: string;
  location: string;
  capacity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const warehouseSchema = new Schema<IWarehouse>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

const Warehouse = mongoose.model<IWarehouse>(
  "Warehouse",
  warehouseSchema
);

export default Warehouse;
