import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User',
  },
  distributor:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Distributor',
  },
  order:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Order',
  },
  amount: {
    type:Number,
    required:true,
  },
  paymentMethod:{
    type:String,
    default: 'Khalti',
  },
  status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
      required: true,
    },
  pidx:{
    type:String,
    required:true
  }
},
{ timestamps: true }
)

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
