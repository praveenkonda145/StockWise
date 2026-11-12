
import mongoose, { Schema, Types } from "mongoose";

interface IStockMovement {
  product: Types.ObjectId;
  type: "IN" | "OUT";
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const stockMovementSchema = new Schema<IStockMovement>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    previousQuantity: {
      type: Number,
      required: true,
      min: 0
    },

    newQuantity: {
      type: Number,
      required: true,
      min: 0
    },

    note: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const StockMovement = mongoose.model<IStockMovement>(
  "StockMovement",
  stockMovementSchema
);

export default StockMovement;
