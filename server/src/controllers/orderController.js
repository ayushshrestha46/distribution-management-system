import asyncHalder from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
class OrderController {
  static createOrder = asyncHalder(async (req, res, next) => {
    try {
      const { orderItems, shippingAddress, paymentMethod } = req.body;

      // orderItems is an array of objects with each object being name, quantity, image, price, product
      if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
      } else {
        // get the ordered items from our database
        const itemsFromDB = await Product.find({
          _id: { $in: orderItems.map((x) => x._id) },
        });
    
        // map over the order items and use the price from our items from database
        const dbOrderItems = orderItems.map((itemFromClient) => {
          const matchingItemFromDB = itemsFromDB.find(
            (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
          );
          return {
            ...itemFromClient,
            product: itemFromClient._id,
            price: matchingItemFromDB.price,
            _id: undefined,
          };
        });
    
        // calculate prices
        const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
          calcPrices(dbOrderItems);
    
        const order = new Order({
          orderItems: dbOrderItems,
          user: req.user._id,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        });
    
        const createdOrder = await order.save();
    
        res.status(201).json({
          success:true,
          message: 'Order has been added Successfully',
          createdOrder
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

}
export default OrderController;


