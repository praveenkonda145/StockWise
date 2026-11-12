
import mongoose, { Schema, Types } from "mongoose";

interface IProduct {
  name: string;
  sku: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  minimumStockLevel: number;
  warehouse?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    description: {
      type: String
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0
    },

    minimumStockLevel: {
      type: Number,
      default: 5,
      min: 0
    },

    warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse"
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
