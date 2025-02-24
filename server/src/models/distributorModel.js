import mongoose from "mongoose";

const DistributorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    areaCovered: {
      // Areas covered by the distributor
      type: [String],
      required: true,
    },
    warehouseDetails: {
      // Warehouse information
      address: { type: String, required: true },

      contactPerson: { type: String, required: true }, // Contact person for the warehouse
    },
    zipCode: {
      type: Number,
      required: true,
    },
    availableBalance: {
      type: Number,
      default: 0,
    },
    vat: {
      type: Number,
      default: 0,
    },
    firstlogin: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Distributor = mongoose.model("Distributor", DistributorSchema);

export default Distributor;
