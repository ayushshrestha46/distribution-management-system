import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a product name"],
    unique: [true, "Product name already exists"],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Distributor",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  holdQuantity: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [250, "Product description can not be more than 100 characters"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    trim: true,
    min: [0, "Price must be a positive number"],
  },
  discountedPrice: {
    type: Number,
    required: false,
    default: 0,
    trim: true,
  },
  discountPercent:{
    type:Number,
    required:false,
    default:0,
    trim:true
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
