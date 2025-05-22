import { asyncHandler } from "../middlewares/asyncHandler.js";
import Distributor from "../models/distributorModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";
import axios from "axios";
import Payment from "../models/paymentModel.js";
class OrderController {
  static createOrder = asyncHandler(async (req, res, next) => {
    try {
      const {
        orderItems,
        shippingAddress,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body;
      // Check if orderItems is empty
      if (!orderItems || orderItems.length === 0) {
        return next(new ErrorHandler("No order items", 400));
      }

      // // Check if the distributor exists
      // const distributorExists = await Distributor.findById(distributor);
      // if (!distributorExists) {
      //   return next(new ErrorHandler("Distributor not found", 404));
      // }

      // // Check if the user is assigned to the distributor
      // const userAssignedToDistributor = distributorExists.shopKeepers.includes(
      //   req.user._id
      // );
      // if (!userAssignedToDistributor) {
      //   return next(
      //     new ErrorHandler("You are not assigned to this distributor", 403)
      //   );
      // }

      // Get the ordered items from the database
      const itemsFromDB = await Product.find({
        _id: { $in: orderItems.map((x) => x.product) },
      });

      // Check if all products are from the specified distributor
      if (itemsFromDB.length !== orderItems.length) {
        return next(
          new ErrorHandler(
            "Some products are not available from this distributor",
            400
          )
        );
      }

      // Map over the order items and use the price from our items from database
      const dbOrderItems = orderItems.map((itemFromClient) => {
        const matchingItemFromDB = itemsFromDB.find(
          (itemFromDB) => itemFromDB._id.toString() === itemFromClient.product
        );

        // Check if the product is in stock
        if (matchingItemFromDB.quantity < itemFromClient.qty) {
          return next(
            new ErrorHandler(
              `Not enough stock for ${matchingItemFromDB.name}`,
              400
            )
          );
        }

        return {
          ...itemFromClient,
          product: itemFromClient.product,
          price: matchingItemFromDB.discountedPrice,
          _id: undefined,
        };
      });

      // Update product quantities and move to hold
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: {
            quantity: -item.qty, // Decrease available quantity
            holdQuantity: item.qty, // Increase hold quantity
          },
        });
      }

      const user = await User.findById(req.user._id);
      const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id,
        distributor: user.distributor,
        shippingAddress,
        taxPrice,
        totalPrice,
      });

      // Save the order
      const createdOrder = await order.save();

      res.status(201).json({
        success: true,
        message: "Order has been added successfully",
        createdOrder,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  // Generate bill

  static generateBill = asyncHandler(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate("user", "name email") // Populate shopkeeper (user who placed order)
        .populate({
          path: "distributor",
          select: "vat warehouseDetails", // Fields from Distributor model
          populate: {
            path: "user", // Now populate the user reference inside distributor
            select: "name email address", // Fields from User model
          },
        });

      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      // Format the bill data
      const billData = {
        distributor: {
          name: order.distributor.user.name,
          vatNo: order.distributor.vat,
          address: order.distributor.user.address,
          taxInvoice: `INV-${order._id.toString().slice(-6).toUpperCase()}`,
          issueDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
        },
        orderSummary: {
          items: order.orderItems.map((item) => ({
            name: item.name,
            quantity: item.qty,
            price: item.price,
            total: item.qty * item.price,
          })),
          customerName: order.user.name,
          vatAmount: order.taxPrice,
          total: order.totalPrice,
        },
        orderId: order._id,
        orderDate: order.createdAt.toISOString().split("T")[0],
      };

      res.status(200).json({
        success: true,
        billData,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  /* DIstributor will accept the order from the retailer */
  static acceptOrder = asyncHandler(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate("user", "name email")
        .populate({
          path: "distributor",
          populate: {
            path: "user",
            select: "name email",
          },
        });
      if (!order) {
        return next(new ErrorHandler("Order not found", 400));
      }
      order.status = "process";

      // Update the stock for each product
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product.holdQuantity >= item.qty) {
          product.holdQuantity -= item.qty;
        } else {
          product.quantity -= item.qty;
        }
        await product.save();
      }

      await order.save();

      // SEND THE MAIL TO THE SHOPKEEPER
      const mailData = {
        shopkeeperName: order.user.name, // Name of the shopkeeper who placed the order
        shopkeeperEmail: order.user.email, // (Optional: if used in the email template)

        // Order details
        orderId: order._id, // Unique order ID
        totalPrice: order.totalPrice, // Formatted total price (e.g., "$150.00" or "₹1,500")

        // Distributor details
        distributorName: order.distributor.user.name, // Name of the distributor who accepted the order
        distributorContact: order.distributor.user.phone,

        contactPerson: order.distributor.warehouseDetails.contactPerson,
      };

      const __filename = fileURLToPath(import.meta.url);
      const currentDirectory = path.dirname(__filename);
      const mailPath = path.join(
        currentDirectory,
        "../mails/orderAccepted.ejs"
      );

      const html = await ejs.renderFile(mailPath, mailData);

      // Sending the mail to the distributor for his account creation
      try {
        if (order.status === "process") {
          await sendMail({
            email: order.user.email,
            subject: "Order has been accepted",
            template: "orderAccepted.ejs",
            data: mailData,
          });
        }
      } catch (mailError) {
        console.error("Mail sending failed:", mailError);
        return next(new ErrorHandler("Failed to send email.", 500));
      }

      return res.status(200).json({
        success: true,
        message: "Order accepted successsfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static rejectOrder = asyncHandler(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found", 400));
      }
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product.holdQuantity >= item.qty) {
          product.holdQuantity -= item.qty;
          product.quantity += item.qty;
        } else {
          product.quantity += item.qty;
        }
        await product.save();
      }

      order.status = "rejected";
      await order.save();
      // TODO: SEND MAIL TO the user regarding the order being rejected
      // SEND THE MAIL TO THE SHOPKEEPER
      const mailData = {
        shopkeeperName: order.user.name, // Name of the shopkeeper who placed the order
        shopkeeperEmail: order.user.name, // (Optional: if used in the email template)

        // Order details
        orderId: order._id, // Unique order ID
        totalPrice: order.totalPrice, // Formatted total price (e.g., "$150.00" or "₹1,500")

        // Distributor details
        distributorName: order.distributor.user.name, // Name of the distributor who accepted the order
        distributorContact: order.distributor.user.phone,

        contactPerson: order.distributor.warehouseDetails.contactPerson,
      };

      const __filename = fileURLToPath(import.meta.url);
      const currentDirectory = path.dirname(__filename);
      const mailPath = path.join(
        currentDirectory,
        "../mails/orderRejected.ejs"
      );

      const html = await ejs.renderFile(mailPath, mailData);

      // Sending the mail to the distributor for his account creation
      try {
        if (order.status === "processs") {
          await sendMail({
            email: order.user.email,
            subject: "Order has been rejected",
            template: "orderRejected.ejs",
            data: mailData,
          });
        }
      } catch (mailError) {
        console.error("Mail sending failed:", mailError);
        return next(new ErrorHandler("Failed to send email.", 500));
      }

      return res.status(200).json({
        success: true,
        message: "Order rejected successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static makeOrderAsDelivered = asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);
      if (!order) {
        return next(new ErrorHandler(error.message, 500));
      }
      order.status = "delivered";
      order.isDelivered = true;
      order.deliveredAt = new Date();
      await order.save();
      return res.status(200).json({
        success: true,
        message: "Order marked as delivered",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  // FOR CASH PAYMENT
  static markPaymentAsPaid = asyncHandler(async (req, res, next) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId);
      if (!order) {
        return next(new ErrorHandler("Order not found", 400));
      }

      order.isPaid = true;
      order.paidAt = new Date();
      await order.save();
      res.status(200).json({
        success: true,
        message: "Order marked as paid",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  // ********* FOR Shops
  static getShopOrders = asyncHandler(async (req, res, next) => {
    try {
      // Fetch orders where the logged-in user is the 'user'
      const orders = await Order.find({ user: req.user._id }).populate({
        path: "distributor", // Populate the Distributor
        select: "user warehouseDetails", // Only fetch the 'user' field from Distributor
        populate: {
          path: "user", // Then populate the User inside Distributor
          select: "name email", // Only fetch the 'name' field from User
        },
      }); // Populate distributor details (only name and email)

      // Send the orders as a response
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  // ********* FOR Distributors
  static getDistributorsOrders = asyncHandler(async (req, res, next) => {
    try {
      // Fetch orders where the logged-in user is the 'distributor'
      const user = await User.findById(req.user._id);
      const distributor = await Distributor.findOne({ user: user._id });
      const orders = await Order.find({ distributor: distributor._id })
        .populate("user", "name email") // Populate user details (only name and email)
        .populate("distributor", "name email")
        .sort({ createdAt: -1 });

      // Send the orders as a response
      res.status(200).json({
        success: true,
        message: " Distributor  orders fetched successfully",
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  // ********************* Payment Method onlin ************************************
  static initiatePayment = asyncHandler(async (req, res, next) => {
    const { amount, purchaseOrderId, purchaseOrderName } = req.body;
    // Convert amount to integer paisa/cents (ensuring it's a whole number)
  const amountInPaisa = Math.round(parseFloat(amount) * 100);
  
  if (isNaN(amountInPaisa) || amountInPaisa <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount provided"
    });
  }
    const user = await User.findById(req.user._id);

    const payload = {
      return_url: "http://localhost:3000/dashboard/orders",
      website_url: "http://localhost:3000",
      amount: amountInPaisa * 100,
      purchase_order_id: purchaseOrderId,
      purchase_order_name: purchaseOrderName,
      customer_info: {
        name: user.name,
        email: user.email,
        phone: user.phone || 908832121,
      },
    };

    try {
      const response = await axios.post(
        `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
        payload,
        {
          headers: {
            Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      res.json({
        success: true,
        payment_url: response.data.payment_url,
        pidx: response.data.pidx,
      });
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      res.status(500).json({
        success: false,
        message: "Payment initiation failed",
      });
    }
  });

  static completePayment = asyncHandler(async (req, res, next) => {
    const { pidx } = req.query;
    const { orderId } = req.body;
    const user = await User.findById(req.user._id);
    if (!pidx) {
      return res
        .status(400)
        .json({ success: false, message: "pidx is required" });
    }
    const verificationResponse = await axios.post(
      `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
      { pidx },
      {
        headers: {
          Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const paymentInfo = verificationResponse.data;
    paymentInfo.total_amount = paymentInfo.total_amount / 100;

    if (paymentInfo.status === "Completed") {
      const order = await Order.findById(orderId);
      console.log(order);
      order.paymentMethod = "Khalti";
      order.isPaid = true;
      order.paidAt = new Date();
      // Send mail to the user id
      // Prepare mail data
      const mailData = {
        user: {
          name: user.name,
          email: user.email,
        },
        order: {
          orderNumber: order._id, // Using appointment ID as order number
          paidAt: order.paidAt, // Current time as payment time
          paymentMethod: "Khalti",
          totalPrice: paymentInfo.total_amount,
          orderItems: order.orderItems,
          // Add any other order details you want to display
        },
        payment: {
          pidx: paymentInfo.pidx,
        },
      };

      // Send email
      try {
        const __filename = fileURLToPath(import.meta.url);
        const currentDirectory = path.dirname(__filename);
        const mailPath = path.join(
          currentDirectory,
          "../mails/paymentSuccessfull.ejs"
        );

        const html = await ejs.renderFile(mailPath, mailData);

        await sendMail({
          email: user.email,
          subject: "Payment Successful",
          template: "paymentSuccessfull.ejs",
          data: mailData,
        });
      } catch (mailError) {
        console.error("Mail sending failed:", mailError);
        // Don't fail the whole request if email fails
      }

      await order.save();

      const thisPayment = await Payment.findOne({ pidx: paymentInfo.pidx });
      if (!thisPayment) {
        // save to the payment models
        await Payment.create({
          user: user._id,
          distributor: order.distributor,
          order: order._id,
          status: "Paid",
          amount: paymentInfo.total_amount,
          pidx: paymentInfo.pidx,
        });
      }

      res.json({
        success: true,
        message: "Payment verified ",
        paymentInfo,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not completed",
        paymentInfo,
      });
    }
  });
}
export default OrderController;
